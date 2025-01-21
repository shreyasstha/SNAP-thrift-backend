import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const saltRounds = 10;

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
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   throw new ApiError(404, "Email already registered");
    // }

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (existingUser) {
      const errorField =
        existingUser.email === email ? "Email" : "Phone number";
      throw new ApiError(400, `${errorField} already exists`);
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

    console.log(req.body);
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

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(404, "Invalid email or password");
    }

    // const accessToken = jwt.sign(
    //   {
    //     data: {
    //       id: user._id,
    //       email: user.email,
    //     },
    //   },
    //   process.env.ACCESS_TOKEN_SECRET,
    //   { expiresIn: "1h" }
    // );

    // Generate tokens
    const generateAccessAndRefreshTokens = async(userId) =>{
      try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken();
       const refreshToken = user.generateRefreshToken();

       user.refreshToken = refreshToken
       await user.save({validateBeforeSave:false})

       return{accessToken, refreshToken};
      }catch(error){
        throw new ApiError(500, "Something went wrong");
      }
    }

    const {accessToken, refreshToken}= await generateAccessAndRefreshTokens(user.id)
    const loggedInUser = await User.findById(user.id)
    // .select("-password - refreshToken")

    const options = {
      httpOnly: true,
      secure: true,
    };

    // Authentication successful
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, {user:loggedInUser, accessToken, refreshToken}, "Login Successful"));
  } catch (error) {
    console.error("Error during login:", error.message);
    throw new ApiError(500, error.message || "Error during login");
  }
});

//Logout route
const logout = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken; //get token from the cookie
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken || !refreshToken) {
    throw new ApiError(404, "No token provided.Already logged out");
  }
  try {
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    console.log("dt: ", decodedToken);
    const userId = await User.findById(decodedToken.data.id).select("-password -refreshToken");
    console.log(`User with ID ${userId} has logged out`);

    res.clearCookie("accessToken");
    res
      .status(200)
      .json(new ApiResponse(200, userId, "User logged out successfully."));
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new ApiError(400, "Invalid Token.");
  }
});

export { register, login, logout };
