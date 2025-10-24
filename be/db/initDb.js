async function ensureTables(pool) {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
         id BIGINT PRIMARY KEY DEFAULT (floor(random() * 1000000000000)::BIGINT),
        name VARCHAR(255) NOT NULL,
        venue TEXT NOT NULL,
        eventdate DATE NOT NULL,
        link TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY DEFAULT (floor(random() * 1000000000000)::BIGINT),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        username VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS invitelinks (
        id BIGINT PRIMARY KEY DEFAULT (floor(random() * 1000000000000)::BIGINT),
       invitationid VARCHAR(255) NOT NULL
      )
    `);

    console.log("✅ db tables are ready");
  } catch (error) {
    console.error("❌ error creating db tables:", error);
  }
}

module.exports = { ensureTables };
