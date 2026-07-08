const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/auth");
const ctrl    = require("../controllers/authController");

router.post("/register",        ctrl.register);
router.post("/login",           ctrl.login);
router.get ("/me",        auth, ctrl.getMe);
router.post("/forgot-password", ctrl.forgotPassword);
router.post("/reset-password",  ctrl.resetPassword);

module.exports = router;
