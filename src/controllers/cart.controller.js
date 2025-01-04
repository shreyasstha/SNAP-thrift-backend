import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  if (!productId) {
    throw new ApiError(400, "Product ID are required.");
  }

  const productData = await Product.findById(productId);
  if (!productData) {
    throw new ApiError(400, `Product ${productId} is invalid.`);
  }

  //check if user already have cart
  let newCart = await Cart.findOne({ userId });
  if (!newCart) {
    newCart = new Cart({
      userId,
      products: [],
    });
  }
  
  newCart.products.push({
    productId: productData._id,
    productName: productData.name,
  })

  const savedCart = await newCart.save();
  res
    .status(201)
    .json(new ApiResponse(201, savedCart, "Cart created successfully."));
});

export { addToCart };
