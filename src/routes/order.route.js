import { Router } from "express";
import {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/createOrder").post(verifyUser, createOrder);
router.route("/getOrderById/:id").get(verifyUser, getOrderById);
router.route("/updateOrder/:id").put(verifyUser, updateOrder);
router.route("/deleteOrder/:id").delete(verifyUser, deleteOrder);



export default router;
