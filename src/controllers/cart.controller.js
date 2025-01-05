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

const getCartById = asyncHandler(async (req, res) => {
  try {
    const cartId = req.params.id;

    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new ApiError(404, "Cart not found.");
    }
    {
      res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart fetched successfully."));
    }
  } catch (error) {
    console.log("Error during fetching cart: ", error.message);
    throw new ApiError(500, error.message || "Error fetching cart");
  }
});

const updateCart = asyncHandler(async (req, res) => {
  try {
    const cartId = req.params.id;
    const updateData = req.body;

    const updatedCart = await Cart.findByIdAndUpdate(cartId, updateData, {
      new: true,
    });
    if (!updatedCart) {
      throw new ApiError(404, "Cart not found.");
    }
    {
      res
        .status(200)
        .json(
          new ApiResponse(200, updateCart, "Cart status updated successfully."
          )
        );
    }
  } catch (error) {
    console.log("Error updating user:", error.message);
    throw new ApiError(500, error.message || "Error updating user");
  }
});

export { addToCart, getCartById, updateCart };
