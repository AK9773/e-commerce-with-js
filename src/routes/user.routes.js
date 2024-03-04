import { Router } from "express";
import {
  registerUser,
  loginUser,
  updateRoleToSeller,
  logoutUser,
  refreshAccessToken,
  changePassword,
  updateRoleToAdmin,
  forgotPassword,
  resetPassword,
} from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJwt, restrictUser } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refreshAccessToken").post(refreshAccessToken);
router.route("/changePassword").patch(verifyJwt, changePassword);
router
  .route("/updateRoleToSeller/:userId")
  .post(verifyJwt, restrictUser("admin"), updateRoleToSeller);

router
  .route("/updateRoleToAdmin/:userId")
  .post(verifyJwt, restrictUser("admin"), updateRoleToAdmin);

router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword").patch(resetPassword);

export default router;
