import Product from "../models/product.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

// Create a new product
const createProduct = asyncHandler(async (req, res) => {
  try {
    const { name, price, image, category, condition } = req.body;

    if (
      [name, price, category, condition].some((field) => {
        field.trim() === "";
      })
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const newProduct = new Product({
      name,
      price,
      image,
      category,
      condition,
    });

    const savedProduct = await newProduct.save();
    res
      .status(201)
      .json(new ApiResponse(201, savedProduct, "Product created successfully"));
  } catch (error) {
    console.error("Error creating product:", error.message);
    throw new ApiError(500, error.message || "Error creating product");
  }
});

export { createProduct };
