import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import {authorize, verifyUser} from "../middlewares/auth.middleware.js"
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/createProduct").post(verifyUser, authorize("admin"), upload.array('images',2), createProduct);
router.route("/getAllProduct").get( getAllProducts);
router.route("/getProductById/:id").get(verifyUser, getProductById);
router.route("/updateProduct/:id").put(verifyUser, authorize("admin"), updateProduct);
router.route("/deleteProduct/:id").delete(verifyUser, authorize("admin"), deleteProduct);

export default router;
