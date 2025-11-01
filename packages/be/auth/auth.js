const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/database");
const { createHash, randomBytes } = require("crypto");
const { sendPasswordResetEmail } = require("../services/email");

async function registerWithCode(req, res) {
  const { invitationid } = req.body;

  const result = await db.query(
    "SELECT * FROM invitelinks WHERE invitationid = $1 AND isvalid = TRUE",
    [invitationid]
  );

  // if the code is valid proceed with regstration
  if (result.rows.length > 0) {
    register(req, res, invitationid);
  } else {
    return res.status(400).json({ error: "the code is not valid" });
  }
}

async function register(req, res, invitationid = null) {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ error: "email, password and username and required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "the password should be at least 8 characters long" });
    }

    const existingEmail = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const existingUsername = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (existingEmail.rows.length > 0 || existingUsername.rows.length) {
      return res.status(400).json({ error: "this user already exists" });
    }

    // has password and insert user
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id, email, username, created_at",
      [email, passwordHash, username]
    );
    const user = result.rows[0];

    // invalidate the registration code if needed
    if (invitationid) {
      console.log("REGISTRATION ID", invitationid);
      await db.query(
        "UPDATE invitelinks SET isvalid = $1 WHERE invitationid = $2 RETURNING *",
        ["FALSE", invitationid]
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
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

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

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

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await db.query(
      "SELECT id, email FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    const user = result.rows[0];

    const resetToken = randomBytes(32).toString("hex");

    const hashedToken = createHash("sha256").update(resetToken).digest("hex");

    const expiresAt = Date.now() + 3600000;

    await db.query(
      "UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3",
      [hashedToken, expiresAt, user.id]
    );

    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      message: "Password reset email sent successfully",
    });
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

    if (!token || !newPassword) {
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
