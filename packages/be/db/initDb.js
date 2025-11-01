const bcrypt = require("bcrypt");

async function ensureTables(pool) {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
         id BIGINT PRIMARY KEY DEFAULT (floor(random() * 1000000000000)::BIGINT),
        name VARCHAR(255) NOT NULL,
        venue TEXT NOT NULL,
        eventdate DATE NOT NULL,
        eventtime TIME,
        link TEXT,
        city TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY DEFAULT (floor(random() * 1000000000000)::BIGINT),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        username VARCHAR(255),
        reset_password_token VARCHAR(255),
        reset_password_expires BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS invitelinks (
        id BIGINT PRIMARY KEY DEFAULT (floor(random() * 1000000000000)::BIGINT),
        invitationid VARCHAR(255) NOT NULL,
        isvalid BOOLEAN DEFAULT TRUE
      )
    `);

    console.log("✅ db tables are ready");

    // create the first user if none are present
    await seedAdminUser(pool);
  } catch (error) {
    console.error("❌ error creating db tables:", error);
  }
}

async function seedAdminUser(pool) {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM users");
    const userCount = parseInt(result.rows[0].count);

    // exit if there is at least one user
    if (userCount > 0) {
      return;
    }

    const adminEmail = "admin@donkeyhorse.boo";
    const adminUsername = "admin";
    const adminPassword = Math.random().toString(36).slice(2, 10);

    console.log("\n============================\n");
    console.log("DATABASE CREDENTIALS");
    console.log("CHANGE THE PASSWORD AFTER THE FIRST LOGIN");
    console.log("admin username", adminUsername);
    console.log("admin password", adminPassword);
    console.log("admin email", adminEmail);
    console.log("\n============================\n");

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await pool.query(
      "INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id, email, username, created_at",
      [adminEmail, passwordHash, adminUsername]
    );
  } catch (error) {
    console.error("❌ error creating admin user", error.message);
    console.error(error.stack);
  }
}

module.exports = { ensureTables };
