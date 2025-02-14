import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 30,
    required: true,
    trim: true,
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
    default: "admin",
  },
},
{
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Package = mongoose.model("Package", packageSchema);
export default Package;
