const bcrypt = require("bcrypt");
const { randomBytes } = require("crypto");

async function createFirstUser(pool) {
  try {
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
    const adminPassword =
      process.env.ADMIN_PASSWORD || randomBytes(18).toString("base64url");

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

module.exports = { createFirstUser };
