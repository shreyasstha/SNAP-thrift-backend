import express from "express";
import { initializePayment, completePayment } from "../controllers/khalti.controller.js";

const router = express.Router();

router.post("/initialize", initializePayment);
router.get("/complete", completePayment);

export default router;
