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
  description: {
    type: String,
  },
  images: [
   { 
      url: {
        type: String, // Cloudinary URL of the image
        required: true,
      },
    }
  
  ],

  size:{
    type: String
  },
  condition:{

  },
  discolor:{

  },
  tear:{

  },
  
  category: {
    type: String,
    trim: true,
    required: true,
    enum: ["clothes", "shoes", "accessories"],
  },
  status: {
    type: String,
    enum: ["Available", "Sold Out"],
    default: "Available", // Default status
  },


  // condition: {
  //   type: String,
  //   trim: true,
  //   required: true,
  //   enum: ["New", "Used - Like New", "Used - Good", "Used - Acceptable"],
  // },

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

const Product = mongoose.model("Product", productSchema);
export default Product;
