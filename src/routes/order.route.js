import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getAllOrder,
  updateOrder,
  deleteOrder,
  getTotalOrders,
} from "../controllers/order.controller.js";
import { authorize, verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/createOrder").post(verifyUser, createOrder);
router.route("/getAllOrder").get( getAllOrder);
router.route("/getOrderById/:id").get(verifyUser, getOrderById);
router.route("/updateOrder/:id").put(verifyUser, updateOrder);
router.route("/deleteOrder/:id").delete(verifyUser, deleteOrder);

router.route("/orderCount").get(verifyUser, getTotalOrders)

export default router;
