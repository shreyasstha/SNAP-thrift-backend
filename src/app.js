import express from "express";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import orderRoutes from "./routes/order.route.js"
import cors from "cors";
import cookieParser from "cookie-parser";

const app =express();

app.use(express.json());
app.use(cors());
app.use(cookieParser())

app.get("/", (req,res) =>{ res.json({message: "welcome to backend, Shreya, happy new year 2025"}) })
app.use("/auth", authRoutes)
app.use("/user", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

app.use(errorHandler)
export default app