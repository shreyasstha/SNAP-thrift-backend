import Package from "../models/package.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

const createPackage = asyncHandler(async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.user; 
    const { location, quantity, price } = req.body; 

    if (!location || !quantity || !price) {
      throw new ApiError(400, "Location, quantity, and price are required");
    }
    
    const newPackage = new Package({
      name,
      email,
      phoneNumber,
      location,
      quantity,
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
    const packages = await Package.find().sort({createdAt: -1});
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

// Get a single package by ID
const getPackageById = asyncHandler(async (req, res) => {
  try {
    // const  {id} = req.params;
    const packageId = req.params.id;

    const packages = await Package.findById(packageId);
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

// Update a package by ID
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

// Delete a package by ID
const deletePackage = asyncHandler(async (req, res) => {
  try {
    const packageId = req.params.id;

    const deletedPackage = await Package.findByIdAndDelete(packageId);
    if (!deletedPackage) {
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

const getTotalPackages = asyncHandler(async (req, res) => {
  try {
    const totalPackages = await Package.countDocuments(); // Count total packages

    res.status(200).json(new ApiResponse(200, { totalPackages }, "Total packages fetched successfully."));
    await Package.updateMany(
      { notification: false },
      { $set: { notification: true } }
    );
  } catch (error) {
    console.error("Error counting packages:", error.message);
    throw new ApiError(500, "Error fetching package count");
  }
});

export {
  createPackage,
  getAllPackage,
  getPackageById,
  updatePackage,
  deletePackage,
  getTotalPackages,
};
