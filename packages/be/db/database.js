const { Pool, types } = require("pg");
const { createFirstUser } = require("./initDb");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL non definito!");
  process.exit(1);
}

console.log("✅ DATABASE_URL configurato");

// return DATE columns as plain 'YYYY-MM-DD' strings instead of js Date objects,
// so the event date never shifts with the server or browser timezone
const DATE_OID = 1082;
types.setTypeParser(DATE_OID, (value) => value);

try {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  pool.on("connect", () => {
    console.log("✅ Connesso al database PostgreSQL");
  });

  pool.on("error", (err) => {
    console.error("❌ Errore database:", err);
  });

  setTimeout(() => {
    createFirstUser(pool);
  }, 2000);

  module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
  };
} catch (error) {
  console.error("❌ Errore inizializzazione Pool:", error.message);
  console.error("Stack:", error.stack);
  process.exit(1);
}
