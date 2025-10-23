const express = require("express");
const db = require("../db/database");
const router = express.Router();

router.get("/events", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM events WHERE eventdate >= CURRENT_DATE - INTERVAL '1 day' AND eventdate < CURRENT_DATE + INTERVAL '14 days' ORDER BY eventdate ASC"
    );
    res.json({ items: result.rows });
  } catch (error) {
    console.error("Errore query:", error);
    res.status(500).json({ error: "Errore server" });
  }
});

router.post("/events", async (req, res) => {
  try {
    const { name, venue, eventdate, link } = req.body;

    const result = await db.query(
      "INSERT INTO events (name, venue, eventdate, link) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, venue, eventdate, link]
    );

    res.status(201).json({ item: result.rows[0] });
  } catch (error) {
    console.error("Errore query:", error);
    res.status(500).json({ error: "Errore server" });
  }
});

module.exports = router;
