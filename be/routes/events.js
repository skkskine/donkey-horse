const express = require("express");
const db = require("../db/database");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

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

router.get("/event/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query("SELECT * FROM events WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Evento non trovato" });
    }

    res.json({ item: result.rows[0] });
  } catch (error) {
    console.error("Errore query:", error);
    res.status(500).json({ error: "Errore server" });
  }
});

router.put("/event/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, venue, eventdate, link } = req.body;

    const result = await db.query(
      "UPDATE events SET name = $1, venue = $2, eventdate = $3, link = $4 WHERE id = $5 RETURNING *",
      [name, venue, eventdate, link, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Evento non trovato" });
    }

    res.json({ item: result.rows[0] });
  } catch (error) {
    console.error("Errore query:", error);
    res.status(500).json({ error: "Errore server" });
  }
});

router.post("/events", authMiddleware, async (req, res) => {
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
