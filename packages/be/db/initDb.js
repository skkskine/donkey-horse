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

    // the password reset link is sent to this address, so it must be one you control
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@example.invalid")
      .trim()
      .toLowerCase();
    const adminUsername = "admin";
    const generatedPassword = !process.env.ADMIN_PASSWORD;
    const adminPassword =
      process.env.ADMIN_PASSWORD || randomBytes(18).toString("base64url");

    console.log("\n============================\n");
    console.log("DATABASE CREDENTIALS");
    console.log("CHANGE THE PASSWORD AFTER THE FIRST LOGIN");
    console.log("admin username", adminUsername);
    // never print a password chosen by the operator, logs are often kept and shared
    if (generatedPassword) {
      console.log("admin password", adminPassword);
    }
    console.log("admin email", adminEmail);
    if (!process.env.ADMIN_EMAIL) {
      console.log("set ADMIN_EMAIL to be able to reset the admin password");
    }
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
