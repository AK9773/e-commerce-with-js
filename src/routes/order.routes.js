import { Router } from "express";
import { restrictUser, verifyJwt } from "../middleware/auth.middleware.js";
import {
  addOrder,
  cancelOrder,
  deliverOrder,
  getOrderByUserId,
} from "../controller/order.controller.js";

const router = Router();

router.route("/addOrder").post(verifyJwt, addOrder);
router.route("/getAllOrderForUser/:userId").get(verifyJwt, getOrderByUserId);
router.route("/cancelOrder/:orderId").patch(verifyJwt, cancelOrder);
router
  .route("/deliverOrder/:orderId")
  .patch(verifyJwt, restrictUser("seller"), deliverOrder);

export default router;
