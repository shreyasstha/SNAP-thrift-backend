import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    max: 30,
    required: true,
    trim: true,
  },
  price: {
    type: String,
    min: 0,
    required: true,
  },
  description:{
    type: String
  },
  location:{
    type:String,
  },
  image: {
    type: String,
  },
  category: {
    type: String,
    trim: true,
    required: true,
    enum: ["clothes", "shoes", "accessories"],
  },
  refreshToken: {
    type: String, // Store refresh token for authentication
  },
  role: {
    type: String,
    enum: ["admin", "seller", "user"],
    default: "seller",
  },
  // condition: {
  //   type: String,
  //   trim: true,
  //   required: true,
  //   enum: ["New", "Used - Like New", "Used - Good", "Used - Acceptable"],
  // },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
