const express = require("express");
const db = require("../db/database");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

const MAX_TEXT_LENGTH = 255;

function isValidText(value, required) {
  if (value === undefined || value === null || value === "") {
    return !required;
  }
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= MAX_TEXT_LENGTH
  );
}

function isValidLink(link) {
  if (!link) {
    return true;
  }
  try {
    return ["http:", "https:"].includes(new URL(link).protocol);
  } catch {
    return false;
  }
}

// returns an error message, or null if the event is valid
function validateEvent({ name, venue, eventdate, link, city, eventtime }) {
  if (!isValidText(name, true)) return "invalid name";
  if (!isValidText(venue, true)) return "invalid venue";
  if (typeof eventdate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(eventdate))
    return "invalid date";
  if (eventtime && !/^\d{2}:\d{2}(:\d{2})?$/.test(eventtime))
    return "invalid time";
  if (!isValidText(city, false)) return "invalid city";
  if (typeof link === "string" && link.length > 2048) return "invalid link";
  if (!isValidLink(link)) return "invalid link";
  return null;
}

function eventParams({ name, venue, eventdate, link, city, eventtime }) {
  return [name, venue, eventdate, link || null, city || null, eventtime || null];
}

function isValidId(id) {
  return /^\d+$/.test(id);
}

router.get("/events", async (req, res) => {
  try {
    const { range } = req.query;

    const nextEventsQuery =
      "SELECT * FROM events WHERE eventdate >= CURRENT_DATE AND eventdate < CURRENT_DATE + INTERVAL '14 days' ORDER BY eventdate ASC, name ASC";
    const allEventsQuery =
      "SELECT * FROM events WHERE eventdate >= CURRENT_DATE ORDER BY eventdate ASC, name ASC";

    const result = await db.query(
      range === "full" ? allEventsQuery : nextEventsQuery
    );
    res.json({ items: result.rows });
  } catch (error) {
    console.error("Errore query:", error);
    res.status(500).json({ error: "server error" });
  }
});

router.get("/event/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(404).json({ error: "event not found" });
    }

    const result = await db.query("SELECT * FROM events WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "event not found" });
    }

    res.json({ item: result.rows[0] });
  } catch (error) {
    console.error("query error:", error);
    res.status(500).json({ error: "server error" });
  }
});

router.put("/event/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(404).json({ error: "event not found" });
    }

    const validationError = validateEvent(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const result = await db.query(
      "UPDATE events SET name = $1, venue = $2, eventdate = $3, link = $4, city = $5, eventtime = $6 WHERE id = $7 RETURNING *",
      [...eventParams(req.body), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "event not found" });
    }

    res.json({ item: result.rows[0] });
  } catch (error) {
    console.error("Errore query:", error);
    res.status(500).json({ error: "server error" });
  }
});

router.post("/events", authMiddleware, async (req, res) => {
  try {
    const validationError = validateEvent(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const result = await db.query(
      "INSERT INTO events (name, venue, eventdate, link, city, eventtime) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      eventParams(req.body)
    );

    res.status(201).json({ item: result.rows[0] });
  } catch (error) {
    console.error("Errore query:", error);
    res.status(500).json({ error: "server error" });
  }
});

router.delete("/event/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(404).json({ error: "event not found" });
    }

    const result = await db.query(
      "DELETE FROM events WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "event not found" });
    }

    res.json({ item: result.rows[0] });
  } catch (error) {
    console.error("Errore query:", error);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
