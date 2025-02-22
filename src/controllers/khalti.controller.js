import { initializeKhaltiPayment, verifyKhaltiPayment } from "../khalti.js";
import Cart from "../models/cart.model.js";
import Payment from "../models/payment.model.js";
import jwt from "jsonwebtoken";

export const initializePayment = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).send({ success: false, message: "Unauthorized. No token provided." });
        }
        
        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            return res.status(401).send({ success: false, message: "Invalid or expired token." });
        }
        
        const userId = decoded.data.id;
        const cart = await Cart.findOne({ userId });

        console.log(`User Cart is: ${cart}`)

        if (!cart || cart.products.length === 0) {
            return res.status(400).send({ success: false, message: "Cart is empty" });
        }



        console.log('init mayment')
        const paymentInitate = await initializeKhaltiPayment({
            amount: cart.totalAmount * 100, // Convert to paisa
            purchase_order_id: cart._id,
            purchase_order_name: `Cart Purchase - ${cart._id}`,
            return_url: `${process.env.BACKEND_URI}/khalti/complete`,
        });

        res.json({ success: true, cart, payment: paymentInitate });
    } catch (error) {
        res.status(500).json({ success: false, message: "An error occurred while initializing payment", error });
    }
};

export const completePayment = async (req, res) => {
    const { pidx, amount, transaction_id, purchase_order_id } = req.query;

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).send({ success: false, message: "Unauthorized. No token provided." });
        }
        
        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            return res.status(401).send({ success: false, message: "Invalid or expired token." });
        }

        const paymentInfo = await verifyKhaltiPayment(pidx);

        if (
            paymentInfo?.status !== "Completed" ||
            paymentInfo.transaction_id !== transaction_id ||
            Number(paymentInfo.total_amount) !== Number(amount)
        ) {
            return res.status(400).json({ success: false, message: "Incomplete or invalid payment information", paymentInfo });
        }

        const cart = await Cart.findOne({ _id: purchase_order_id });

        if (!cart) {
            return res.status(400).send({ success: false, message: "Cart not found" });
        }

        await Cart.findByIdAndDelete(purchase_order_id);

        const paymentData = await Payment.create({
            pidx,
            transactionId: transaction_id,
            cartId: purchase_order_id,
            amount,
            dataFromVerificationReq: paymentInfo,
            apiQueryFromUser: req.query,
            paymentGateway: "khalti",
            status: "success",
        });

        res.json({ success: true, message: "Payment verified and cart purchase completed successfully", paymentData });
    } catch (error) {
        res.status(500).json({ success: false, message: "An error occurred during payment verification", error });
    }
};
