import mongoose from "mongoose";

const purchasedItemSchema = new mongoose.Schema(
  {
    product: {
      // Changed from "item" to "product" for consistency with your route
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Ensure the reference points to your Product model
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ["khalti"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const PurchasedItem = mongoose.model("PurchasedItem", purchasedItemSchema);
export default PurchasedItem;
