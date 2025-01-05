import { Router } from "express";
import { addToCart, getCartById, updateCart } from "../controllers/cart.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/").post(verifyUser,addToCart);
router.route("/:id").get(verifyUser,getCartById);
router.route("/:id").put(verifyUser,updateCart);

export default router;