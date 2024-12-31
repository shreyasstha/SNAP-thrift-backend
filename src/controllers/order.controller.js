import Order from "../models/order.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create a new order
const createOrder = asyncHandler(async (req, res) => {
  const { user, items, totalAmount, shippingAddress } = req.body;

  if (!user || !items || !totalAmount || !shippingAddress) {
    throw new ApiError(400, "All fields are required to create an order.");
  }

  const order = new Order({
    user,
    items,
    totalAmount,
    shippingAddress,
  });

  const savedOrder = await order.save();

  res
    .status(201)
    .json(new ApiResponse(201, savedOrder, "Order created successfully."));
});

// Get an order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate("user items.product");
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully."));
});

// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(
      400,
      `Invalid status. Allowed statuses: ${allowedStatuses.join(", ")}`
    );
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  if (!updatedOrder) {
    throw new ApiError(404, "Order not found.");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedOrder, "Order status updated successfully.")
    );
});

// Delete an order
const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedOrder = await Order.findByIdAndDelete(id);
  if (!deletedOrder) {
    throw new ApiError(404, "Order not found.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedOrder, "Order deleted successfully."));
});

export { createOrder, getOrderById, updateOrderStatus, deleteOrder };
