import { Router } from "express";
import { addToCart } from "../controllers/cart.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/").post(verifyUser,addToCart);

export default router;