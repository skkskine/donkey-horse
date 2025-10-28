const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/database");

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

async function updatePassword(req, res) {
  try {
    const { username, password } = req.body;

    if (!password || !username) {
      return res
        .status(400)
        .json({ error: "username and password and required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "the password should be at least 8 characters long" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await db.query(
      "UPDATE users SET password_hash = $1 WHERE username = $2 RETURNING id, username, email, created_at",
      [passwordHash, username]
    );

    const user = result.rows[0];

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
    return res.status(500).json({ error: "error updating your password" });
  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
  registerWithCode,
  updatePassword,
};
