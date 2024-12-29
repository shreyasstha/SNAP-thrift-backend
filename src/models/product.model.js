import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        max: 30,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    image: {
        type: String,
    
    },
    category: {
        type:String,
        trim: true,
        required: true,
        enum: [
            "clothes",
            "shoes",
            "accessories"
        ],
    },
    condition: {
        type: String,
        trim: true,
        required: true,
        enum: ["New", "Used - Like New", "Used - Good", "Used - Acceptable"],
    },
    
    
});

const Product = mongoose.model("Product", productSchema);
export default Product;