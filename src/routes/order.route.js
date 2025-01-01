import { Router } from "express";
import {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controller.js";

const router = Router();

router.route("/").post(createOrder);
router.route("/:id").get(getOrderById);
router.route("/:id").put(updateOrder);
router.route("/:id").delete(deleteOrder);


export default router;
