import {Router} from "express";
import { register, login, logout, verifyEmail } from "../controllers/auth.controller.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verify-email").post(verifyEmail)
router.route("/logout").post(logout);


export default router;