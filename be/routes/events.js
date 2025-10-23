const express = require("express");
const db = require("../db/database");
const router = express.Router();

router.post("/events", async (req, res) => {
  try {
    const { name, venue, eventDate, link } = req.body;

    const result = await db.query(
      "INSERT INTO events (name, venue, eventDate, link) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, venue, eventDate, link]
    );

    res.status(201).json({ item: result.rows[0] });
  } catch (error) {
    console.error("Errore query:", error);
    res.status(500).json({ error: "Errore server" });
  }
});

module.exports = router;
