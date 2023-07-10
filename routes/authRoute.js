import express from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  testController,
  updateProfileController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// create router object
const router = express.Router();

// routes
// REGISTER Route || POST
router.post("/register", registerController);

// LOGIN Route || POST
router.post("/login", loginController);

// FORGOT PASSWORD Route || POST
router.post("/forgot-password", forgotPasswordController);

// Test Route
// to check token bases protection on routes
router.get("/test", requireSignIn, isAdmin, testController);

// protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

// protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, async (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

export default router;
