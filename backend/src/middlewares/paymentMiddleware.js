const { Payment } = require("../models");

const verifyPayment = async (req, res, next) => {
  console.log("Payment Verified ", req.user.id);
  next();
};

module.exports = { verifyPayment };