const express = require("express");
const { register, login, getCurrentUser } = require("../auth/auth");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
