import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 30,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    //unique: true,
    lowercase: true, // Convert email to lowercase
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "Contact number is required"],
    max: [10, "Number must be at least 10 digits"],
  },
  location:{
    type: String,
    required: true,
    trim: true
  },
  quantity:{
    type: String,
    required: true,
    min: 1,
  },
  price: {
    type: String,
    min: 0,
    required: true,
  },
  refreshToken: {
    type: String, // Store refresh token for authentication
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
},
{
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Package = mongoose.model("Package", packageSchema);
export default Package;
