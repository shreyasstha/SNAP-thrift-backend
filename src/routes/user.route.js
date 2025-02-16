import { Router } from "express";
import { verifyUser, authorize } from "../middlewares/auth.middleware.js";
import {getAllUsers, getUserById, getProfile, updateUser, deleteUser} from "../controllers/user.controller.js";

const router = Router();


// router.route("/getAllUsers").get( getAllUsers);
// router.route("/getUser/:id").get(getUserById);
// router.route("/updateUser/:id").put(updateUser);
// router.route("/deleteUser/:id").delete(deleteUser);

// Only authenticated users can view their profile
router.route("/getUser").get(verifyUser, getUserById);


// router.route("/profile").get(verifyUser, getUserProfile);
router.route("/me").get(verifyUser,getProfile);

// Only admin can fetch all users
router.route("/getAllUsers").get(verifyUser, authorize("admin"), getAllUsers);

router.route("/updateUser/:id").put(verifyUser, updateUser);

//Only admin can delete a user
router.route("/deleteUser/:id").delete(verifyUser, authorize("admin"), deleteUser);

export default router;