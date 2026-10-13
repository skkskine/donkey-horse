const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/database");
const { createHash, randomBytes } = require("crypto");
const { sendPasswordResetEmail } = require("../services/email");

// thrown when the registration data is not valid, the message is safe to show to the client
class RegistrationError extends Error {}

function signToken(user) {
  return jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

// validates the data and inserts the user using the given client (pool or transaction)
async function createUser(client, { email, password, username }) {
  if (!email || !password || !username) {
    throw new RegistrationError("email, password and username and required");
  }

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof username !== "string"
  ) {
    throw new RegistrationError("email, password and username must be text");
  }

  if (password.length < 8) {
    throw new RegistrationError(
      "the password should be at least 8 characters long"
    );
  }

  const normalizedEmail = normalizeEmail(email);
  const trimmedUsername = username.trim();

  const existingUser = await client.query(
    "SELECT id FROM users WHERE lower(email) = $1 OR username = $2",
    [normalizedEmail, trimmedUsername]
  );

  if (existingUser.rows.length > 0) {
    throw new RegistrationError("this user already exists");
  }

  // hash password and insert user
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const result = await client.query(
      "INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id, email, username, created_at",
      [normalizedEmail, passwordHash, trimmedUsername]
    );
    return result.rows[0];
  } catch (error) {
    // unique violation: the same user was registered by a concurrent request
    if (error.code === "23505") {
      throw new RegistrationError("this user already exists");
    }
    throw error;
  }
}

function sendRegisteredUser(res, user) {
  res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    token: signToken(user),
  });
}

async function registerWithCode(req, res) {
  const { invitationid } = req.body;

  if (typeof invitationid !== "string") {
    return res.status(400).json({ error: "the code is not valid" });
  }

  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    // consume the code atomically, so it can't be used by concurrent requests
    const consumed = await client.query(
      "UPDATE invitelinks SET isvalid = FALSE WHERE invitationid = $1 AND isvalid = TRUE RETURNING id",
      [invitationid]
    );

    if (consumed.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "the code is not valid" });
    }

    const user = await createUser(client, req.body);
    await client.query("COMMIT");

    sendRegisteredUser(res, user);
  } catch (error) {
    // restores the code if the registration fails
    await client.query("ROLLBACK");

    if (error instanceof RegistrationError) {
      return res.status(400).json({ error: error.message });
    }
    console.error("registration error:", error);
    res.status(500).json({ error: "server error" });
  } finally {
    client.release();
  }
}

async function register(req, res) {
  try {
    const user = await createUser(db, req.body);
    sendRegisteredUser(res, user);
  } catch (error) {
    if (error instanceof RegistrationError) {
      return res.status(400).json({ error: error.message });
    }
    console.error("registration error:", error);
    res.status(500).json({ error: "server error" });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Email e password obbligatori" });
    }

    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "credentials are not valid" });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: "credentials are not valid" });
    }

    const token = signToken(user);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({ error: "server error" });
  }
}

async function getCurrentUser(req, res) {
  try {
    const result = await db.query(
      "SELECT id, email, username, created_at FROM users WHERE id = $1",
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "user not found" });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error("get uesr error:", error);
    res.status(500).json({ error: "server error" });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }

    // same response whether the email exists or not, to avoid user enumeration
    const genericResponse = {
      message: "If that email exists, a reset link has been sent.",
    };

    const result = await db.query(
      "SELECT id, email FROM users WHERE lower(email) = $1",
      [normalizeEmail(email)]
    );

    if (result.rows.length === 0) {
      return res.status(200).json(genericResponse);
    }

    const user = result.rows[0];

    const resetToken = randomBytes(32).toString("hex");

    const hashedToken = createHash("sha256").update(resetToken).digest("hex");

    const expiresAt = Date.now() + 3600000;

    await db.query(
      "UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3",
      [hashedToken, expiresAt, user.id]
    );

    // not awaited, so the response time doesn't reveal whether the email exists
    sendPasswordResetEmail(user.email, resetToken).catch((error) =>
      console.error("Password reset email error:", error)
    );

    res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: "Error processing request. Please try again later.",
    });
  }
}

async function updatePassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (typeof token !== "string" || typeof newPassword !== "string") {
      return res.status(400).json({
        message: "Token and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    const hashedToken = createHash("sha256").update(token).digest("hex");

    const result = await db.query(
      `SELECT id, email FROM users 
       WHERE reset_password_token = $1 
       AND reset_password_expires > $2`,
      [hashedToken, Date.now()]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    const user = result.rows[0];

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      `UPDATE users 
       SET password_hash = $1, 
           reset_password_token = NULL, 
           reset_password_expires = NULL 
       WHERE id = $2`,
      [hashedPassword, user.id]
    );

    res.status(200).json({
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Error resetting password. Please try again.",
    });
  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
  registerWithCode,
  updatePassword,
  forgotPassword,
};
