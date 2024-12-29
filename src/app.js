import express from "express";
import authRoutes from "./routes/auth.route.js"
import errorHandler from "./middlewares/errorHandler.middleware.js";
import productRoutes from "./routes/product.route.js"

const app =express();

app.use(express.json());

app.use("/auth", authRoutes)
app.use("/products", productRoutes);

app.use(errorHandler)
export default app