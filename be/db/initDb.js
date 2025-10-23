export default async function ensureTables() {
  try {
    // Items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        venue TEXT NOT NULL,
        eventDate DATE NOT NULL,
        link TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Tabelle del database pronte");
  } catch (error) {
    console.error("❌ Errore setup tabelle:", error);
  }
}
