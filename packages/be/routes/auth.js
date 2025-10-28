const express = require("express");
const {
  register,
  login,
  getCurrentUser,
  registerWithCode,
  updatePassword,
} = require("../auth/auth");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

router.post("/register", authMiddleware, register);
router.post("/register-with-code", registerWithCode);
router.post("/login", login);
router.post("/update-password", authMiddleware, updatePassword);
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
