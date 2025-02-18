import { Router } from "express";
import { addToCart, deleteCart, deleteProductFromCart, getCartById } from "../controllers/cart.controller.js";
import { verifyUser,authorize } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/addToCart").post(verifyUser, authorize("user"), addToCart);
router.route("/getCart/:id").get(verifyUser,getCartById);
//router.route("/:id").put(verifyUser,updateCart);
router.route("/updateCart/").put(verifyUser,deleteProductFromCart);
router.route("/deleteCart/:id").delete(verifyUser,deleteCart);
export default router;
