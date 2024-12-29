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
        field.trim() === "";
      })
    ) {
      throw new ApiError(404, "All fields are required");
    }

    console.log("hgfhg", User)

    // Check if email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        
      throw new ApiError(404, "Email already registered");
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
      .json(new ApiResponse(201, savedUser, "data saved successfully"));
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
        field.trim() === "";
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

    const accessToken = jwt.sign(
      {
        data: {
          id: user._id,
          email: user.email,
        },
      },
      "secret",
      { expiresIn: "1h" }
    );

    const options = {
    httpOnly: true,
    secure: true
    }

    // Authentication successful
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200, user, "Login Successful"));
  } catch (error) {
    console.error("Error during login:", error.message);
    throw new ApiError(500, error.message || "Error during login");
  }
});

export { register, login };
