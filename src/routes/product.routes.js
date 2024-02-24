import { Router } from "express";
import { verifyJwt, restrictUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProductList,
  getProductListOfSeller,
  updateProductDetails,
  updateProductImages,
  updateProductThumbnail,
} from "../controller/product.controller.js";

const router = Router();

router.route("/getProductList").get(getProductList);
router.route("/getProduct/:productId").get(getProduct);
router.route("/addProduct").post(
  verifyJwt,
  restrictUser("seller"),
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  addProduct
);

router
  .route("/updateProductDetails/:productId")
  .patch(verifyJwt, restrictUser("seller", "admin"), updateProductDetails);

router
  .route("/updateThumbnail/:productId")
  .patch(
    verifyJwt,
    restrictUser("seller", "admin"),
    upload.single("thumbnail"),
    updateProductThumbnail
  );

router.route("/updateImages/:productId").patch(
  verifyJwt,
  restrictUser("seller", "admin"),
  upload.fields([
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  updateProductImages
);

router
  .route("/deleteProduct/:productId")
  .delete(verifyJwt, restrictUser("seller", "admin"), deleteProduct);

router
  .route("/getProductListOfSeller")
  .get(verifyJwt, restrictUser("seller", "admin"), getProductListOfSeller);

export default router;
