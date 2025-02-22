import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
  try {
    const { phoneNumber, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;
    const { name } = req.user;

    // Fetch user's cart
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart || cart.products.length === 0) {
      throw new ApiError(400, "Your cart is empty.");
    }

    let totalAmount = 0;
    const orderedProducts = cart.products.map((item) => {
      //map: returns a new array
      totalAmount += Number(item.productId.price);
      console.log(item);
      console.log(item.productId.price);
      return {
        productId: item.productId._id,
        productName: item.productId.name,
        productPrice: item.productId.price,
        productImage: [...item.productId.images],
        //productImage: item.productId.images.map((image) => image.url),
      };
    });

    let paymentStatus = "Pending";
    if (paymentMethod === "khalti") {
      paymentStatus = "Paid"; // For Khalti, initiate payment first
    }

    // Create order
    const newOrder = new Order({
      userId,
      name,
      phoneNumber,
      products: orderedProducts,
      totalAmount,
      shippingAddress,
      status: "Pending",
      paymentStatus: paymentStatus,
      paymentMethod: paymentMethod,
    });

    //if order is already been placed
    // const existingOrder = await Order.findOne({ userId, status: "Pending" });
    // if (existingOrder) {
    //   throw new ApiError(400, "You already have a pending order.");
    // }

    const savedOrder = await newOrder.save();

    // Clear user's cart after placing the order
       await Cart.findByIdAndDelete(cart.id);
   

    // Mark ordered products as Sold Out
    await Product.updateMany(
      { _id: { $in: cart.products.map((p) => p.productId) } },
      { $set: { isSoldOut: true } }
    );

    res
      .status(201)
      .json(new ApiResponse(201, savedOrder, "Order created successfully."));
  } catch (error) {
    console.log("error in create order", error);
  }
});

// const createOrder = asyncHandler(async (req, res) => {
//   const { phoneNumber, shippingAddress, paymentMethod } = req.body;
//   const userId = req.user.id;
//   const { name } = req.user;

//   // Fetch user's cart
//   const cart = await Cart.findOne({ userId }).populate("products.productId");
//   if (!cart || cart.products.length === 0) {
//     throw new ApiError(400, "Your cart is empty.");
//   }

//   let totalAmount = 0;
//   const orderedProducts = cart.products.map((item) => {
//     //map: returns a new array
//     totalAmount += Number(item.productId.price);
//     console.log((item))
//     console.log(item.productId.price)
//     return {
//       productId: item.productId._id,
//       productName: item.productId.name,
//       productPrice: item.productId.price,
//       productImage: [...item.productId.images],
//       //productImage: item.productId.images.map((image) => image.url),
//     };
//   });

//   let paymentStatus = "Pending";
//   if (paymentMethod === "Khalti") {
//     paymentStatus = "Paid"; // For Khalti, initiate payment first
//   }

//   // Create order
//   const newOrder = new Order({
//     userId,
//     name,
//     phoneNumber,
//     products: orderedProducts,
//     totalAmount,
//     shippingAddress,
//     status: "Pending",
//     paymentStatus: paymentStatus,
//     paymentMethod: paymentMethod,
//   });

//   //if order is already been placed
//   // const existingOrder = await Order.findOne({ userId, status: "Pending" });
//   // if (existingOrder) {
//   //   throw new ApiError(400, "You already have a pending order.");
//   // }

//   const savedOrder = await newOrder.save();

//   // Clear user's cart after placing the order
//   // if(status === "Confirmed"){
//   //     await Cart.findByIdAndDelete(cart.id);
//   // }

//   // Mark ordered products as Sold Out
//   await Product.updateMany(
//     { _id: { $in: cart.products.map((p) => p.productId) } },
//     { $set: { isSoldOut: true } }
//   );

//   res
//     .status(201)
//     .json(new ApiResponse(201, savedOrder, "Order created successfully."));
// });

// Get an order by ID
const getOrderById = asyncHandler(async (req, res) => {
  try {
    const orderId = req.params.id;
    //const order = await Order.findById(orderId).populate("userId"); //populate= full product details

    const order = await Order.findById(orderId)
      .populate("userId", "name email")
      .populate("products.productId");

    if (!order) {
      throw new ApiError(404, "Order not found.");
    } else {
      res
        .status(200)
        .json(new ApiResponse(200, order, "Order fetched successfully."));
    }
  } catch (error) {
    console.log("Error during fetching order: ", error.message);
    throw new ApiError(500, error.message || "Error fetching order");
  }
});

const getAllOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.find().sort({createdAt: -1});
    if (order.length === 0) {
      throw new ApiError(404, "No order found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, order, "order fetched successfully"));
  } catch (error) {
    console.error("Error fetching order:", error.message);
    throw new ApiError(500, error.message || "Error fetching order");
  }
});

// Update order status
const updateOrder = asyncHandler(async (req, res) => {
  try {
    const orderId = req.params.id;
    const updateData = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    });
    if (!updatedOrder) {
      throw new ApiError(404, "Order not found.");
    } 
    // if (updateData.status === "Confirmed") {
    //   await Cart.findOneAndDelete({ userId: updatedOrder.userId });
    //}
    else {
      res
        .status(200)
        .json(new ApiResponse(200, updatedOrder, "Order status updated successfully."));
    }
  } catch (error) {
    console.log("Error updating order:", error.message);
    throw new ApiError(500, error.message || "Error updating order");
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

export { createOrder, getOrderById, getAllOrder, updateOrder, deleteOrder };
