import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
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
    description: {
      type: String,
      trim: true,
    },
    images: [
      {
        url: {
          type: String, // Cloudinary URL of the image
          required: true,
        },
      },
    ],
    size: {
      type: String,
      required: true,
      enum: ["S", "M", "L"],
    },
    condition: {
      type: String,
      required: true,
      enum: ["new", "used", "like new"],
      default: "used",
    },
    discolor: {
      type: Boolean, // Indicates whether discoloration exists
      default: false,
    },
    tear: {
      type: Boolean, // Indicates whether the product has tears
      default: false,
    },
    category: {
      type: String,
      trim: true,
      required: true,
      enum: ["clothing", "shoes", "accessories"],
    },
    status: {
      type: String,
      enum: ["Available", "Sold Out"],
      default: "Available", // Default status
    },
    refreshToken: {
      type: String, // Store refresh token for authentication
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },

    isSoldOut: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
