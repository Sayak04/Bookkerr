import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFilterController,
  productListController,
  productPhotoController,
  relatedProductController,
  searchProductController,
  updateProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

// routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

router.put(
  "/update-product/:id",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);


// get products
router.get("/get-product", getProductController);

// get single product
router.get("/get-product/:slug", getSingleProductController);

// get photo
router.get("/product-photo/:id", productPhotoController);

// delete product
router.delete("/delete-product/:id", deleteProductController);

// filter product
router.post('/product-filters', productFilterController);

// product-count
router.get('/product-count', productCountController);

// product per page
router.get('/product-list/:page', productListController);

// search product
router.get('/search/:keyword', searchProductController);

// similar product
router.get('/related-product/:id/:cid', relatedProductController);

// category wise product
router.get('/product-category/:slug', productCategoryController);

export default router;
