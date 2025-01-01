import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create a new order
const createOrder = asyncHandler(async (req, res) => {
  const { userId, products, shippingAddress } = req.body;

  // Validate user
  if (!userId) {
    throw new ApiError(401, "User ID is required to place an order.");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found or not logged in.");
  }

  // Validate products
  if (!products || products.length === 0) {
    throw new ApiError(400, "Product details are required to create an order.");
  }

  // if (!user || !product || !shippingAddress || product.length === 0) {
  //   throw new ApiError(400, "All fields are required to create an order.");
  // }

  // Calculate total amount and check stock
  let totalAmount = 0;
  const validProducts = [];
  for (const item of products) {
    const productData = await Product.findById(item.productId);
    // if (!productData || productData.Stock < item.quantity) {
    //   throw new ApiError(400, `Product ${item.productId} is out of stock or invalid.`);
    // }
    if (!productData) {
      throw new ApiError(400,`Product ${item.productId} is invalid.` );
    }
    totalAmount += productData.price;
    validProducts.push({
      productId: productData.id,
      //quantity: productData.quantity,
      productName: productData.name, // Include product name
    });
  }

  // Create order
  const newOrder = new Order({
    user: userId,
    products: validProducts,
    totalAmount,
    shippingAddress,
    //status: "Pending",
  });
  
  const savedOrder = await newOrder.save();

  // Deduct stock
  // for (const item of validProducts) {
  //   await Product.findByIdAndUpdate(item.productId, {
  //     $inc: { Stock: -item.quantity },
  //   });
  // }

  res
    .status(201)
    .json(new ApiResponse(201, savedOrder, "Order created successfully."));
});

// Get an order by ID
const getOrderById = asyncHandler(async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    //const order = await Order.findById(orderId).populate("user items.product");
    if (!order) {
      throw new ApiError(404, "Order not found.");
    }
    {
      res
        .status(200)
        .json(new ApiResponse(200, order, "Order fetched successfully."));
    }
  } catch (error) {
    console.log("Error during fetching order: ", error.message);
    throw new ApiError(500, error.message || "Error fetching order");
  }
});

// Update order status
const updateOrder = asyncHandler(async (req, res) => {
  try {
    const orderId = req.params.id;
    const updateData = req.body;

    // const allowedStatuses = [
    //   "Pending",
    //   "Confirmed",
    //   "Shipped",
    //   "Delivered",
    //   "Cancelled",
    // ];
    // if (!allowedStatuses.includes(updateData.status)) {
    //   throw new ApiError(400, `Invalid status. Allowed statuses: ${allowedStatuses.join(", ")}`);
    // }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    });
    if (!updatedOrder) {
      throw new ApiError(404, "Order not found.");
    }
    {
      res
        .status(200)
        .json(new ApiResponse(200, updatedOrder, "Order status updated successfully."));
    }
  } catch (error) {
    console.log("Error updating user:", error.message);
    throw new ApiError(500, error.message || "Error updating user");
  }
});

// Delete an order
const deleteOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  const deletedOrder = await Order.findByIdAndDelete(orderId);
  if (!deletedOrder) {
    throw new ApiError(404, "Order not found.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedOrder, "Order deleted successfully."));
});

export { createOrder, getOrderById, updateOrder, deleteOrder };
