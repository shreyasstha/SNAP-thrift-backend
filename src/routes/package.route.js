import { Router } from "express";
import {
    createPackage,
    getAllPackage,
    getPackageById,
    updatePackage,
    deletePackage,
    getTotalPackages
} from "../controllers/package.controller.js";
import {verifyUser} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/createPackage").post(verifyUser,  createPackage);
router.route("/getAllPackage").get( getAllPackage);
router.route("/getPackageById/:id").get(verifyUser, getPackageById);
router.route("/updatePackage/:id").put(verifyUser, updatePackage);
router.route("/deletePackage/:id").delete(verifyUser, deletePackage);

router.route("/packageCount").get(verifyUser,getTotalPackages )

export default router;
