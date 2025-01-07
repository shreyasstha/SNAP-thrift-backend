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

  const cart = await Cart.findOne({ userId }).populate("products.productId"); // Populate product details
  if (!cart || cart.products.length === 0) {
    throw new ApiError(400, "Your cart is empty.");
  }

  let totalAmount = 0;
  for (const item of cart.products) {
    const productData = item.productId;

    if (!productData) {
      throw new ApiError(400, `Product ${item.productId} is invalid.`);
    }
    totalAmount += Number(productData.price); 
    item.productPrice = productData.price;
  }

  // cart.totalAmount = totalAmount; // Set totalAmount field in the cart
  // await cart.save();

  //check if user already have cart
  let newCart = await Cart.findOne({ userId });
  if (!newCart) {
    newCart = new Cart({
      userId,
      products: [],
      totalAmount,
    });
  }

  // Check if the product already exists in the cart
  const existingProductIndex = newCart.products.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingProductIndex !== -1) {
    //newCart.products[existingProductIndex].quantity += 1;
    throw new ApiError(400, "Product already exists in cart.");
  } else {
    newCart.products.push({
      productId: productData._id,
      productName: productData.name,
      productPrice: productData.price,
    });
  }

  const savedCart = await newCart.save();
  res
    .status(201)
    .json(new ApiResponse(201, savedCart, "Cart created successfully."));
});

//get cart
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

//update cart (delete product from cart?)
const deleteProductFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  if (!productId) {
    throw new ApiError(400, "Product ID is required.");
  }

  // Find the cart associated with the user
  const newCart = await Cart.findOne({ userId });
  if (!newCart) {
    throw new ApiError(404, "Cart not found for the user.");
  }

  //Check if the product exists in the cart
  const productIndex = newCart.products.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (productIndex === -1) {
    throw new ApiError(404, "Product not found in the cart.");
  }

  // Remove the product from the cart
  newCart.products.splice(productIndex, 1);

  // Save the updated cart
  const updatedCart = await newCart.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCart,
        "Product removed from cart successfully."
      )
    );
});

const deleteCart = asyncHandler(async (req, res) => {
  const cartId = req.params.id;

  const deleteCart = await Cart.findByIdAndDelete(cartId);
  if (!deleteCart) {
    throw new ApiError(404, "Cart not found.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deleteCart, "Cart deleted successfully."));
});

export { addToCart, getCartById, deleteProductFromCart, deleteCart };
