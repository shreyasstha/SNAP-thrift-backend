import express from "express";
import { initializeKhaltiPayment, verifyKhaltiPayment } from "../khalti.js";
import Product from "../models/product.model.js";
import PurchasedItem from "../models/purchasedItem.model.js";
import Payment from "../models/payment.model.js";

const router = express.Router();

// Route to initialize Khalti payment gateway
router.post("/initialize", async (req, res) => {
    try {
        const { productId, totalPrice, website_url } = req.body;

        // Validate product data
        const productData = await Product.findOne({
            _id: productId,
            price: totalPrice.toString(),
        });

        if (!productData) {
            return res.status(400).send({
                success: false,
                message: "Product not found",
            });
        }

        // Create a purchase document to store purchase info
        const purchasedItemData = await PurchasedItem.create({
            product: productId,
            paymentMethod: "khalti",
            totalPrice: totalPrice * 100,
        });

        const paymentInitate = await initializeKhaltiPayment({
            amount: totalPrice * 100, // amount in paisa
            purchase_order_id: purchasedItemData._id,
            purchase_order_name: productData.name,
            return_url: `${process.env.BACKEND_URI}/khalti/complete`,
            website_url,
        });

        res.json({
            success: true,
            purchasedItemData,
            payment: paymentInitate,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while initializing payment",
            error,
        });
    }
});

// Route to verify Khalti payment
router.get("/complete", async (req, res) => {
    const {
        pidx,
        txnId,
        amount,
        mobile,
        purchase_order_id,
        purchase_order_name,
        transaction_id,
    } = req.query;

    try {
        const paymentInfo = await verifyKhaltiPayment(pidx);

        if (
            paymentInfo?.status !== "Completed" ||
            paymentInfo.transaction_id !== transaction_id ||
            Number(paymentInfo.total_amount) !== Number(amount)
        ) {
            return res.status(400).json({
                success: false,
                message: "Incomplete or invalid payment information",
                paymentInfo,
            });
        }

        const purchasedItemData = await PurchasedItem.findOne({
            _id: purchase_order_id,
            totalPrice: amount,
        });

        if (!purchasedItemData) {
            return res.status(400).send({
                success: false,
                message: "Purchased item not found",
            });
        }

        // Update purchase record
        await PurchasedItem.findByIdAndUpdate(
            purchase_order_id,
            { $set: { status: "completed" } }
        );

        // Create a new payment record
        const paymentData = await Payment.create({
            pidx,
            transactionId: transaction_id,
            productId: purchase_order_id,
            amount,
            dataFromVerificationReq: paymentInfo,
            apiQueryFromUser: req.query,
            paymentGateway: "khalti",
            status: "success",
        });

        res.json({
            success: true,
            message: "Payment verified and completed successfully",
            paymentData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred during payment verification",
            error,
        });
    }
});

// Route to create a test product
router.get("/create-product", async (req, res) => {
    try {
        const productData = await Product.create({
            name: "Test Product1",
            price: 200,
            description: "Nothing",
            category: "clothes",
            size: "S"
        });

        res.json({
            success: true,
            product: productData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the product",
            error,
        });
    }
});

export default router;
