const { PhoneNumber, User } = require("../models");
const { Sequelize } = require("sequelize");

async function addPhoneNumber(req, res, next) {
  try {
    const userId = req.user.id;
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Number is required" });
    }

    let number = await PhoneNumber.findOne({ where: { userId } });

    if (number) {
      number.phone = phone;
      await number.save();
    } else {
      number = await PhoneNumber.create({
        userId,
        phone
      });
    }

    if (process.env.LOG === "true") {
      console.log("Number upserted", "User ID", userId, phone);
    }

    return res.status(201).json({
      message: "Number saved successfully",
      number
    });
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      return res.status(409).json({ message: "Number already exists" });
    }

    next(error);
  }
}

async function getPhoneNumber(req, res, next) {
  try {
    const userId = req.user.id;

    const numbers = await PhoneNumber.findAll({
      where: { userId }
    });

    if (!numbers.length) {
      return res.status(404).json({ message: "No numbers found" });
    }

    return res.status(200).json(numbers);
  } catch (error) {
    next(error);
  }
}

async function updatePhoneNumber(req, res, next) {
  try {
    const userId = req.user.id;
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Number is required" });
    }

    let number = await PhoneNumber.findOne({
      where: { userId }
    });

    if (!number) {
      number = await PhoneNumber.create({ userId, phone });
    } else {
      number.phone = phone;
      await number.save();
    }

    return res.status(200).json({
      message: "Number saved successfully",
      number
    });
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      return res.status(409).json({ message: "Number already exists" });
    }

    next(error);
  }
}

module.exports = {
  addPhoneNumber,
  getPhoneNumber,
  updatePhoneNumber
};
