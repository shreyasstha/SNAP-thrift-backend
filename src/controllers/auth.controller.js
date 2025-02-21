import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendVerificationEmail, sendThankYouEmail } from "../utils/mailer.js";

// Generate tokens
export const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log("id", user);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    console.log("at:", accessToken);
    console.log("rt:", refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};

// Generate a 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const register = asyncHandler(async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body; // Removed verificationCode from req.body
    console.log(req.body);
    if (
      [name, email, phoneNumber, password].some(
        (field) => !field || field.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    // Check if email or phone number already exists in the database
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      const errors = [];
      if (existingUser.email === email) {
        errors.push("Email already registered");
      }
      if (existingUser.phoneNumber === phoneNumber) {
        errors.push("Phone number already registered");
      }
      throw new ApiError(404, errors.join(" and "));
    }

    // Ensure only specific emails can register as admin
    const allowedAdminEmails = ["admin@gmail.com"];
    const isAdmin = allowedAdminEmails.includes(email);
    const userRole = isAdmin ? "admin" : "user";

    // Hash the password before saving to database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate verification code
    const verificationCode = generateVerificationCode(); // Added server-side generation

    // Create a new user object with the hashed password and verification code
    const newUser = new User({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
      verificationCode, // Store the generated code
      isVerified: false,
    });

    const savedUser = await newUser.save(); // Save the user in the database

    // Send verification email with the generated code
    await sendVerificationEmail(email, verificationCode);

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          savedUser,
          "User registered successfully. Check your email for verification code"
        )
      );
  } catch (error) {
    console.error("Error during registration:", error);
    throw new ApiError(500, error.message || "Error saving user");
  }
});

const login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if ([email, password].some((field) => !field || field.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found. Please sign up.");
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid password.");
    }
    if (!user.isVerified) {
      return res.status(400).json({
        message:
          "Email not verified. Please check your email for verification code.",
      });
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    // Exclude sensitive fields like password and refreshToken from the response
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    // Cookie options
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    // Authentication successful, send response
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  } catch (error) {
    console.error("Error during login:", error.message);
    next(error);
  }
});

// Email Verification
const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check verification code
    if (user.verificationCode.toString() !== verificationCode.toString()) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Mark user as verified and remove the code
    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    // Send Thank You Email after successful verification
    await sendThankYouEmail(email, user.name); // Changed user.firstName to user.name based on your schema

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Error during email verification:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// Logout route
const logout = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  console.log("from logout");
  console.log("This is access", accessToken);
  console.log("This is refresh", refreshToken);

  if (!accessToken || !refreshToken) {
    throw new ApiError(404, "No tokens provided. Already logged out.");
  }

  try {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    console.log("dt: ", decodedToken);
    const userId = await User.findById(decodedToken.data.id).select(
      "-password -refreshToken"
    );
    console.log(`User with ID ${userId} has logged out`);

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, userId, "User logged out successfully."));
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new ApiError(400, "Invalid Token.");
  }
});

export { register, login, logout, verifyEmail, refreshAccessToken };