import express from "express";
import { initializePayment, completePayment } from "../controllers/khalti.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/initialize",verifyUser, initializePayment);
router.get("/complete", completePayment);

export default router;
