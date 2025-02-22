import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productPrice:{
    type: String,
    min: 0,
    required: true,
  },
  productImage: [
    {
      url: {
        type: String, // Cloudinary URL of the image
        required: true,
      },
    },
  ],
  // quantity: {
  //   type: Number,
  //   required: true,
  //   default: 1,
  // },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name:{
    type: String,
    required: true
  },

  products: [cartProductSchema],

  totalAmount: {
    type: String,
    required: true,
  },
  
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;