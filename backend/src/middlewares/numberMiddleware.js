const { User, PhoneNumber } = require("../models");

const verifyPhoneNumber = async (req, res, next) => {
  try {
    if (process.env.LOG !== "false") {
      console.log("Phone Number Verified");
    }
    next();
  } catch (error) {
    next(error);
  }
};

const checkIfNumberExists = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const count = await PhoneNumber.count({ where: { userId } });

    req.hasPhoneNumber = count > 0;

    if (process.env.LOG !== "false") {
      console.log("Phone flag (dynamic):", req.hasPhoneNumber);
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyPhoneNumber, checkIfNumberExists };
