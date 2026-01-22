require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

require("./models/User");
require("./models/Product");

const app = require("./app");
const sequelize = require("./config/database");


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
