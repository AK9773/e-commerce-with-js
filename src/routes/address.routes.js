import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import {
  addAddress,
  deleteAddress,
  getAddress,
  updateAddress,
} from "../controller/address.controller.js";

const router = Router();

router.route("/addAddress").post(verifyJwt, addAddress);
router.route("/getAddress").get(verifyJwt, getAddress);
router.route("/updateAddress").patch(verifyJwt, updateAddress);
router.route("/deleteAddress/:addressId").delete(verifyJwt, deleteAddress);

export default router;
