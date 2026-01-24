const { User } = require("../models");

const verifyPhoneNumber = async (req, res, next) => {
  try {
    if (process.env.LOG !== "false") {
      console.log("Phone Number Verified");
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Authorization failed" });
  }
};

const checkIfNumberExists = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ["phoneNumberProvided"]
    });

    req.hasPhoneNumber = !!user?.phoneNumberProvided;

    if (process.env.LOG !== "false") {
      console.log("Phone flag:", req.hasPhoneNumber);
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Verification failed" });
  }
};

module.exports = { verifyPhoneNumber, checkIfNumberExists };
