import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import {
  addToCart,
  deleteByCartId,
  findByUserId,
  insertManyToCart,
  updateProductQuantity,
} from "../controller/cart.controller.js";

const router = Router();

router.route("/addToCart").post(verifyJwt, addToCart);
router.route("/insertManyToCart").post(verifyJwt, insertManyToCart);
router.route("/updateQuantity").patch(verifyJwt, updateProductQuantity);
router.route("/cartItems").get(verifyJwt, findByUserId);
router.route("/delete/:cartId").delete(verifyJwt, deleteByCartId);

export default router;
