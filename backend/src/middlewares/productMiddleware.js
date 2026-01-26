const { User } = require("../models");

const verifyIfSeller = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log("Verifying Seller for User ID:", userId);
    const user = await User.findByPk(userId, {
      attributes: ["canSell", "role"]
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    console.log("User Role:", user.role, "Can Sell:", user.canSell);
    if (!user.canSell && user.role !== "admin") {
      return res.status(403).json({ message: "Seller access required" });
    }
    if (process.env.LOG !== "false") {
      console.log("Seller Verified");
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyIfSeller };
