const jwt = require("jsonwebtoken");
const db = require("../db/database");

async function authMiddleware(req, res, next) {
  let decoded;

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "missing token" });
    }

    const token = authHeader.substring(7);
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "token is not valid" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "expired token" });
    }
    return res.status(500).json({ error: "auth error" });
  }

  try {
    // the token is revoked when the user is deleted or the password is reset
    const result = await db.query(
      "SELECT token_version FROM users WHERE id = $1",
      [decoded.userId]
    );

    if (
      result.rows.length === 0 ||
      // tokens issued before token_version existed count as version 0
      result.rows[0].token_version !== (decoded.tokenVersion ?? 0)
    ) {
      return res.status(401).json({ error: "token is not valid" });
    }
  } catch (error) {
    console.error("auth error:", error);
    return res.status(500).json({ error: "auth error" });
  }

  req.user = decoded;
  next();
}

module.exports = authMiddleware;
