import { Router } from "express";
import {getUserById, updateUser, deleteUser} from "../controllers/user.controller.js";


const router = Router();

router.route("/getUser/:id").get(getUserById);
router.route("/updateUser/:id").put(updateUser);
router.route("/deleteUser/:id").delete(deleteUser);

export default router;