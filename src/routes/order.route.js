import { Router } from "express";
import {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyUser, createOrder);
router.route("/:id").get(verifyUser, getOrderById);
router.route("/:id").put(verifyUser, updateOrder);
router.route("/:id").delete(verifyUser, deleteOrder);


export default router;
