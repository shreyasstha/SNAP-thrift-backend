import { Router } from "express";
import {
  createOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/order.controller.js";

const router = Router();

router.route("/").post(createOrder);
router.route("/:id", getOrderById);


export default router;
