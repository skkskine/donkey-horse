const express = require("express");
const db = require("../db/database");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

const MAX_TEXT_LENGTH = 255;
const ARCHIVE_PAGE_SIZE = 10;

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

// 'YYYY-MM-DD' and a real calendar day (rejects e.g. 2024-02-30)
function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return !isNaN(date) && date.toISOString().slice(0, 10) === value;
}

// returns an error message, or null if the event is valid
function validateEvent({ name, venue, eventdate, link, city, eventtime }) {
  if (!isValidText(name, true)) return "invalid name";
  if (!isValidText(venue, true)) return "invalid venue";
  if (!isValidDate(eventdate)) return "invalid date";
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

// past events, most recent first, optionally filtered by a from/to date range
router.get("/events/archive", async (req, res) => {
  try {
    const { page = "1", from, to } = req.query;

    const pageNumber = Number(page);
    if (
      typeof page !== "string" ||
      !/^\d+$/.test(page) ||
      pageNumber < 1 ||
      !Number.isSafeInteger(pageNumber)
    ) {
      return res.status(400).json({ error: "invalid page" });
    }
    if ((from && !isValidDate(from)) || (to && !isValidDate(to))) {
      return res.status(400).json({ error: "invalid date" });
    }
    if (from && to && from > to) {
      return res.status(400).json({ error: "invalid date range" });
    }

    const where =
      "WHERE eventdate < CURRENT_DATE AND ($1::date IS NULL OR eventdate >= $1) AND ($2::date IS NULL OR eventdate <= $2)";
    const filters = [from || null, to || null];

    const [itemsResult, countResult] = await Promise.all([
      db.query(
        `SELECT * FROM events ${where} ORDER BY eventdate DESC, name ASC LIMIT $3 OFFSET $4`,
        [...filters, ARCHIVE_PAGE_SIZE, (pageNumber - 1) * ARCHIVE_PAGE_SIZE]
      ),
      db.query(`SELECT COUNT(*)::int AS total FROM events ${where}`, filters),
    ]);

    const total = countResult.rows[0].total;
    res.json({
      items: itemsResult.rows,
      page: pageNumber,
      pageSize: ARCHIVE_PAGE_SIZE,
      total,
      totalPages: Math.max(1, Math.ceil(total / ARCHIVE_PAGE_SIZE)),
    });
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
