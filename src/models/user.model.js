import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true, // Remove unnecessary whitespace
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true, // Convert email to lowercase
    trim: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  accessToken: {
    type: String, // Store refresh token for authentication
  },
  refreshToken: {
    type: String, // Store refresh token for authentication
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  phoneNumber: {
    type: String,
    required: [true, "Contact number is required"],
    max: [10, "Number must be at least 10 digits"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    min: [6, "Password must be at least 6 characters long"],
    max: [128, "Password must be at most 128 characters long"],
  },
  otp:{
    type: String,
  },
  otpExpires:{
    type: Date
  }
});

userSchema.methods.generateAccessToken = function () {
  try {
    const accessToken = jwt.sign(
      {
        data: {
          id: this._id,
          email: this.email,
          role: this.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    return accessToken;
  } catch (error) {
    console.error("Error during generating accessToken:", error.message);
    throw new ApiError(500, error.message || "Error during login");
  }
};
userSchema.methods.generateRefreshToken = function () {
  try {
    const refreshToken = jwt.sign(
      {
        data: {
          id: this._id,
          email: this.email,
          role: this.role,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    return refreshToken;
  } catch (error) {
    console.error("Error during generating refreshToken:", error.message);
    throw new ApiError(500, error.message || "Error during login");
  }
};

const User = mongoose.model("User", userSchema);
export default User;
