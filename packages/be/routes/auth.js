const express = require("express");
const {
  register,
  login,
  getCurrentUser,
  registerWithCode,
} = require("../auth/auth");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

router.post("/register", authMiddleware, register);
router.post("/register-with-code", registerWithCode);
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
