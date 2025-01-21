import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import {verifyUser} from "../middlewares/auth.middleware.js"
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/createProduct").post(verifyUser,  upload.array('product', 2), createProduct);
router.route("/getAllProduct").get( getAllProducts);
router.route("/getProductById/:id").get(verifyUser, getProductById);
router.route("/updateProduct/:id").put(verifyUser, updateProduct);
router.route("/deleteProduct/:id").delete(verifyUser, deleteProduct);

export default router;
