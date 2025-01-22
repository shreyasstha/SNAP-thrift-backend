import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const saltRounds = 10;

// Generate tokens
export const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log("id", user)
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

const register = asyncHandler(async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    console.log(req.body);
    if (
      [name, email, phoneNumber, password].some((field) => {
        !field || field.trim() === "";
      })
    ) {
      throw new ApiError(404, "All fields are required");
    }

    // Check if email already exists in the database
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

    // Hash the password before saving to database
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create a new user object with the hashed password
    const newUser = new User({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save(); // Save the user in the database
    res
      .status(201)
      .json(new ApiResponse(201, savedUser, "User registered successfully"));
  } catch (error) {
    console.error("Error during registration:", error);
    throw new ApiError(500, error.message || "Error saving user");
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email psw",req.body);

    if (
      [email, password].some((field) => {
        !field || field.trim() === "";
      })
    ) {
      throw new ApiError(404, "All fields are required");
    }

    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found. Please sign up.");
    }

    //check password
    const plainPassword = password;
    const hashedPassword = user.password;
    console.log(plainPassword, hashedPassword);

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("first", isPasswordValid)
    if (!isPasswordValid) {
      throw new ApiError(404, "Invalid email or password");
      
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    console.log("This is access",accessToken)
    console.log("This is access",refreshToken)

      const loggedInUser = await User.findById(user._id).
      select("-password -refreshToken")
    
    const options = {
      httpOnly: true,//Makes the cookie inaccessible to client-side JavaScript
      secure: true,// Ensures the cookie is only sent over secure HTTPS connections
    };
    //Authentication successful
    res
      .status(200) //for browser
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken",refreshToken,options)// Adds a cookie named "accessToken" containing the JWT, using the options defined earlier.
      .json(new ApiResponse(200, {user:loggedInUser,accessToken,refreshToken},"User logged in  successful"));
  }
   catch (error) {
    console.log("Error during login:", error.message);
    throw new ApiError(500, "Error during login");
  }

  const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request");
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
          new ApiResponse(200,{ accessToken, refreshToken: newRefreshToken },"Access token refreshed"));
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid refresh token");
    }
  });
});

//Logout route
const logout = asyncHandler(async (req, res) => {
  // Get tokens from cookies
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // Check if both tokens exist
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
      httpOnly: true, //Makes the cookie inaccessible to client-side JavaScript
      secure: true, // Ensures the cookie is only sent over secure HTTPS connections
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
export { register, login, logout };
