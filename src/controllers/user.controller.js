import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get all user
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      throw new ApiError(404, "No users found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw new ApiError(500, error.message || "Error fetching users");
  }
});

//get user by id
const getUserById = asyncHandler(async (req, res) => {
  console.log("Received userId:", req.params.id);

  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    {
      res
        .status(200)
        .json(new ApiResponse(200, user, "User fetched successfully"));
    }
  } catch (error) {
    console.log("Error during fetching user: ", error.message);
    throw new ApiError(500, error.message || "Error fetching user");
  }
});

// Ensure users can only access their own profile (unless they are an admin)
const getProfile = asyncHandler(async(req, res)=>{
  res.status(200).json(new ApiResponse(200, req.user, "User profile fetched successfully."));
})


//update user
const updateUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the updated data against schema
    });

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }
    {
      res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "User updated successfully"));
      console.log("Updated Successfully");
    }
  } catch (error) {
    console.log("Error updating user:", error.message);
    throw new ApiError(500, error.message || "Error updating user");
  }
});

//delete user
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new ApiError(404, "User not found");
    }
    {
      res
        .status(200)
        .json(new ApiResponse(200, deletedUser, "User deleted successfully"));
      console.log("Deleted Successfully");
    }
  } catch (error) {
    console.error("Error deleting product:", error.message);
    throw new ApiError(500, error.message || "Error deleting product");
  }
});

export { getAllUsers, getUserById, getProfile, updateUser, deleteUser };
