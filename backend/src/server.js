require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const { sequelize } = require("./models");

sequelize.sync(); // or migrations


const app = require("./app");



const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully");

    await sequelize.sync({ alter: true });
    console.log("Models synced");

    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
})();
