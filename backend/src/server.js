require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const { sequelize } = require("./models");
const runSeeds = require("./seeders");
const app = require("./app");

const PORT = process.env.PORT || 8000;

async function resetDatabase() {
  await sequelize.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully");

    // await resetDatabase();
    // console.log("Database reset");

    await sequelize.sync({ force: false, alter: true });
    console.log("Models synced");

    // await runSeeds();
    // console.log("Seed data inserted");

    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
})();
