const express = require("express");
const db = require("../db/database");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { randomUUID } = require("crypto");
const { INVITE_VALIDITY } = require("../auth/auth");

router.get("/invite/:invitationId", async (req, res) => {
  try {
    const { invitationId } = req.params;

    const result = await db.query(
      "SELECT id FROM invitelinks WHERE invitationid = $1 AND isvalid = true AND created_at > NOW() - $2::interval",
      [invitationId, INVITE_VALIDITY]
    );

    if (result.rows.length === 0) {
      res.json({ valid: false });
    } else {
      res.json({ valid: true });
    }
  } catch (error) {
    console.error("query error:", error);
    res.status(500).json({ error: "server error" });
  }
});

router.post("/invite", authMiddleware, async (req, res) => {
  try {
    const invitationId = randomUUID();

    const result = await db.query(
      "INSERT INTO invitelinks (invitationid, isvalid) VALUES ($1, $2) RETURNING *",
      [invitationId, true]
    );

    res.status(201).json({ item: result.rows[0] });
  } catch (error) {
    console.error("query query:", error);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
