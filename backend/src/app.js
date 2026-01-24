const express = require("express");
const cors = require("cors");
const { limiter, authLimiter } = require("./middlewares/authMiddleware");
const app = express();

app.use(cors());
app.use(express.json());
app.use(limiter)

app.use("/api/cart", require("./routes/cartRotutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/auth",authLimiter, require("./routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("E-commerce API is running");
});

module.exports = app;
