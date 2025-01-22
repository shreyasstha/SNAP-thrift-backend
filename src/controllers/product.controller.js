import Product from "../models/product.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create a new product
const createProduct = asyncHandler(async (req, res) => {
  try {
    const { name, price, category, condition } = req.body;

    if (
      [name, price, category, condition].some((field) => {
        field.trim() === "";
      })
    ) {
      throw new ApiError(400, "All fields are required");
    }
    
    const productImages= req.files;
    console.log(req.files)

  //  const productImageLocalPath = productImage ? productImage.path:null;
  //  console.log("this is url",productImageLocalPath);

    // const productPath=await uploadOnCloudinary(productImageLocalPath)
    // console.log("this is product path",productPath);

  // console.log(req.files); // Logs all uploaded files

// const productImages = req.files; // Get all uploaded files

if (!productImages || productImages.length === 0) {
  throw new ApiError(404, "No files uploaded");
}

// Array to store Cloudinary URLs for all images
const productPaths = [];

for (const productImage of productImages) {

  const productImageLocalPath = productImage.path; // Local path for each image
  console.log("this is local path", productImageLocalPath);

  // Upload each image to Cloudinary
  const productPath = await uploadOnCloudinary(productImageLocalPath);
  console.log("this is product path", productPath);

  // Add the Cloudinary URL to the array
  productPaths.push({ url: productPath.url,});
}

// Final result: Array of Cloudinary URLs
console.log("All uploaded image paths:", productPaths);



    const newProduct = new Product({
      name,
      price,
      // image1,image2,
      images:productPaths,
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

// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      throw new ApiError(404, "No products found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, products, "Products fetched successfully"));
  } catch (error) {
    console.error("Error fetching products:", error.message);
    throw new ApiError(500, error.message || "Error fetching products");
  }
});

// Get a single product by ID
const getProductById = asyncHandler(async (req, res) => {
  try {
    // const  {id} = req.params;
    const productId= req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, product, "Product fetched successfully"));
  } catch (error) {
    console.error("Error fetching product:", error.message);
    throw new ApiError(500, error.message || "Error fetching product");
  }
});

// Update a product by ID
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const  productId = req.params.id;

    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      throw new ApiError(404, "Product not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedProduct, "Product updated successfully")
      );
  } catch (error) {
    console.error("Error updating product:", error.message);
    throw new ApiError(500, error.message || "Error updating product");
  }
});

// Delete a product by ID
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      throw new ApiError(404, "Product not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, null, "Product deleted successfully"));
  } catch (error) {
    console.error("Error deleting product:", error.message);
    throw new ApiError(500, error.message || "Error deleting product");
  }
});

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
