import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import {verifyUser} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/").post(verifyUser, createProduct);
router.route("/getAllProduct").get(getAllProducts);
router.route("/getProductById/:id").get(verifyUser, getProductById);
router.route("/:id").put(verifyUser, updateProduct);
router.route("/:id").delete(verifyUser, deleteProduct);

export default router;
