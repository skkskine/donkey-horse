const { Pool } = require("pg");
require("dotenv").config();
const { ensureTables } = require("./initDb");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

ensureTables(pool);

pool.on("connect", () => {
  console.log("✅ Connesso al database PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Errore database:", err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
