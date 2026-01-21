const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
app.use("/api/auth", require("./routes/authRoutes"));

  res.send("E-commerce API is running");
});

module.exports = app;
