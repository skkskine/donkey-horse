const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "missing token" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "token is not valid" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "expired token" });
    }
    return res.status(500).json({ error: "auth error" });
  }
}

module.exports = authMiddleware;
