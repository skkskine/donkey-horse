const express = require("express");
const db = require("../db/database");
const router = express.Router();

router.post("/events", async (req, res) => {
  try {
    const { name } = req.body;

    const result = await db.query(
      "INSERT INTO events (name) VALUES ($1) RETURNING *",
      [name]
    );

    res.status(201).json({ item: result.rows[0] });
  } catch (error) {
    console.error("Errore query:", error);
    res.status(500).json({ error: "Errore server" });
  }
});

module.exports = router;
