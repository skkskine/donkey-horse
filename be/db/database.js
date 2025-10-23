const { Pool } = require("pg");
const { default: ensureTables } = require("./initDb");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

await ensureTables();

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
