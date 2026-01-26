const { PhoneNumber } = require("../models");

function isValidPhone(p) {
  return p && typeof p === "string" && p.length >= 10 && /^[0-9+\- ]+$/.test(p);
}

const verifyPhoneNumber = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Number is required" });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Invalid phone number (min 10 digits)" });
    }

    if (process.env.LOG !== "false") {
      console.log("Phone Number Format Verified");
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