import mongoose from "mongoose";

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
  refreshToken: {
    type: String, // Store refresh token for authentication
  },
  role : {
    type: String,
    enum: ["admin","seller", "user"],
    default:"user"
  },
  phoneNumber: {
    type: String,
    required: [true, "Contact number is required"],
    //unique: true,
    // validate: {
    //   validator: function (value) {
    //     // Regex to ensure exactly 10 digits
    //     return /^\d{10}$/.test(value);
    //   },
    //   message: "Contact number must be exactly 10 digits",
    // },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    min: [6, "Password must be at least 6 characters long"],
    max: [128, "Password must be at most 128 characters long"],
  },
});

const User = mongoose.model("User", userSchema);
export default User;
