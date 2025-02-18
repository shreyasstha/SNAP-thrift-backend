import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

import errorHandler from "./middlewares/errorHandler.middleware.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import packageRoutes from "./routes/package.route.js"
import khaltiRoutes from "./routes/khalti.route.js";
// import paymentRoutes from "./routes/payment.route.js"

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", // Allow only your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the backend, Shreya. Happy New Year 2025!" });
});

// Register routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/package", packageRoutes);
app.use("/khalti", khaltiRoutes); // Add Khalti routes
//app.use("/payment", paymentRoutes);

app.use(errorHandler);

export default app;
