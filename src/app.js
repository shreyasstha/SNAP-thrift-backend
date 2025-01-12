import express from "express";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import orderRoutes from "./routes/order.route.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app =express();

app.use(express.json());
app.use(bodyParser.json());

app.use(cors());
app.use(cookieParser())


// app.post('/upload', upload.single('profile'), function (req, res, next) {
//     console.log("req:", req.file);
//     // req.file is the `avatar` file
//     // req.body will hold the text fields, if there were any
//     res.status(200).json({message:"successful"})
// })
// app.use("/image", imageRoutes)

app.get("/", (req,res) =>{ res.json({message: "welcome to backend, Shreya, happy new year 2025"}) })
app.use("/auth", authRoutes)
app.use("/user", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

app.use(errorHandler)
export default app