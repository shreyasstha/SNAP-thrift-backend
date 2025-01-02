import express from "express";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import productRoutes from "./routes/product.route.js"
import orderRoutes from "./routes/order.route.js"
import cors from "cors";

const app =express();

app.use(express.json());
app.use(cors());

app.use('/images', express.static('images'));

app.get("/", (req,res) =>{ res.json({message: "welcome to backend, Shreya, happy new year 2025"}) })
app.use("/auth", authRoutes)
app.use("/user", userRoutes);
app.use("/products", productRoutes);
app.use("/order", orderRoutes);

app.use(errorHandler)
export default app