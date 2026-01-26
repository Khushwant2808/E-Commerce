const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again after 15 minutes." }
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50000,
  message: { message: "Too many login attempts, please try again after an hour" }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided!" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    if (process.env.LOG !== "false") {
      console.log("User Verified", req.user.id);
    }
    next();
  } catch (err) {
    const errorMessage = err.name === "TokenExpiredError"
      ? "Your session has expired. Please log in again."
      : "Invalid token. Authentication failed.";

    res.status(403).json({ message: errorMessage });
  }
};

module.exports = { limiter, authLimiter, authenticateToken };