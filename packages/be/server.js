const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("❌ JWT_SECRET mancante o più corto di 32 caratteri!");
  process.exit(1);
}

const authRoutes = require("./routes/auth");
const eventsRouter = require("./routes/events");
const inviteRouter = require("./routes/invite");

const app = express();
const PORT = process.env.PORT || 3000;

// set TRUST_PROXY=1 when running behind a reverse proxy, so rate limiting sees the real client ip
if (process.env.TRUST_PROXY) {
  app.set("trust proxy", Number(process.env.TRUST_PROXY));
}

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : false }));
app.use(express.json({ limit: "100kb" }));

// limit brute force on login, password reset and registration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "too many requests, try again later" },
});

app.use(
  [
    "/api/auth/login",
    "/api/auth/forgot-password",
    "/api/auth/update-password",
    "/api/auth/register-with-code",
  ],
  authLimiter
);

app.use("/api/auth", authRoutes);
app.use("/api", eventsRouter, inviteRouter);

// health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
