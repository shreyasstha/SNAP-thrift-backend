
import Package from "../models/product.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

// Create a new product
const createPackage = asyncHandler(async (req, res) => {
  try {
    const { name, price } = req.body;

    if (
      [name, price].some((field) => 
        !field || field.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }
    

    const newPackage = new Package({
      name,
      price,
    });

    const savedPackage = await newPackage.save();
    res
      .status(201)
      .json(new ApiResponse(201, savedPackage, "Package created successfully"));
  } catch (error) {
    console.error("Error creating package:", error.message);
    throw new ApiError(500, error.message || "Error creating package");
  }
});

const getAllPackage = asyncHandler(async (req, res) => {
    try {
      const packages = await Product.find();
      if (packages.length === 0) {
        throw new ApiError(404, "No packages found");
      }
      res
        .status(200)
        .json(new ApiResponse(200, packages, "packages fetched successfully"));
    } catch (error) {
      console.error("Error fetching packages:", error.message);
      throw new ApiError(500, error.message || "Error fetching packages");
    }
  });

// Get a single product by ID
const getPackageById = asyncHandler(async (req, res) => {
  try {
    // const  {id} = req.params;
    const packageId = req.params.id;

    const packages = await Product.findById(packageId);
    if (!packages) {
      throw new ApiError(404, "package not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, packages, "package fetched successfully"));
  } catch (error) {
    console.error("Error fetching package:", error.message);
    throw new ApiError(500, error.message || "Error fetching package");
  }
});

// Update a product by ID
const updatePackage = asyncHandler(async (req, res) => {
  try {
    const packageId = req.params.id;

    const updatedPackage = await Package.findByIdAndUpdate(
        packageId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPackage) {
      throw new ApiError(404, "package not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedPackage, "package updated successfully")
      );
  } catch (error) {
    console.error("Error updating package:", error.message);
    throw new ApiError(500, error.message || "Error updating package");
  }
});

// Delete a product by ID
const deletePackage = asyncHandler(async (req, res) => {
  try {
    const packageId = req.params.id;

    const deletedPackage = await Product.findByIdAndDelete(packageId);
    if (!deletedProduct) {
      throw new ApiError(404, "package not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, null, "package deleted successfully"));
  } catch (error) {
    console.error("Error deleting package:", error.message);
    throw new ApiError(500, error.message || "Error deleting package");
  }
});

export {
    createPackage,
    getAllPackage,
    getPackageById,
    updatePackage,
    deletePackage
};
