const express = require("express");
const router = express.Router();
const AuthVerification = require("../middlewares/AuthVerification");
const UserController = require("../controllers/UserController");
const SettingController = require("../controllers/SettingController");
const InvoiceController = require("../controllers/InvoiceController");

//! User
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/logout", UserController.logout);
router.get("/profile-read", AuthVerification, UserController.profile_read);
router.post("/profile-update", AuthVerification, UserController.profile_update);
router.get("/verify", AuthVerification, UserController.EmailVerifyData);
router.post("/forgot-password/:email", UserController.RecoverVerifyEmail);
router.post("/otp-verify/:email/:otp", UserController.RecoverVerifyOTP);
router.post("/reset-password/:email/:otp", UserController.ResetPassword);

//! Settings
router.post("/setting", AuthVerification, SettingController.setting);
router.get("/setting_read", AuthVerification, SettingController.setting_read);

//! Invoice
router.post("/create-invoice", AuthVerification, InvoiceController.create);
router.get("/read-all", AuthVerification, InvoiceController.read_all);
router.get(
  "/read-single/:invoice_id",
  AuthVerification,
  InvoiceController.read_single
);
router.post(
  "/update_single/:invoice_id",
  AuthVerification,
  InvoiceController.update_single
);
router.delete(
  "/delete_single/:invoice_id",
  AuthVerification,
  InvoiceController.delete_single
);
router.delete("/delete_all", AuthVerification, InvoiceController.delete_all);
router.get("/get-dashboard-data", AuthVerification, InvoiceController.getDashboard);

module.exports = router;
