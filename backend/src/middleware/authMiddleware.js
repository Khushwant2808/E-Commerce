const rateLimit = require("express-rate-limit");


const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1000000, //for testing
  standardHeaders: true, 
  legacyHeaders: false, 
  message: { message: "Too many requests, please try again after 15 minutes." }
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50000, //for testing 
  message: { message: "Too many login attempts, please try again after an hour" }
});

module.exports = { limiter, authLimiter };