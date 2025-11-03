const express = require("express");
const db = require("../db/database");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/settings", authMiddleware, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM settings");

    res.status(200).json({ settings: result.rows });
  } catch (error) {
    console.error("query query:", error);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
