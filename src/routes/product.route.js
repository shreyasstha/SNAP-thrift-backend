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

router.route("/").post(createProduct);
router.route("/getAllProduct").get(getAllProducts);
router.route("/:id",verifyUser).get(getProductById);
router.route("/:id").put(updateProduct);
router.route("/:id").delete(deleteProduct);

export default router;
