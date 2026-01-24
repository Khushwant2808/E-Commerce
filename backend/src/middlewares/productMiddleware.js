const { User } = require("../models");

const verifyIfSeller = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ["canSell", "role"]  //OPTIMISATION
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.canSell && user.role !== "admin") {
      return res.status(403).json({ message: "Seller access required" });
    }
    if (process.env.LOG !== "false"){
        console.log("Seller Verified")
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Authorization failed" });
  }
};

module.exports = { verifyIfSeller };
