const { Address, User } = require("../models");

const sanitize = (str) => {
  if (typeof str !== "string") return str;
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

async function addAddress(req, res, next) {
  try {
    const userId = req.user.id;
    let { line1, line2, city, state, pincode, country, isDefault } = req.body;

    if (!line1 || !city || !state || !pincode) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    line1 = sanitize(line1);
    line2 = sanitize(line2);
    city = sanitize(city);
    state = sanitize(state);

    if (isDefault === true) {
      await Address.update(
        { isDefault: false },
        { where: { userId } }
      );
    }

    const address = await Address.create({
      userId,
      line1,
      line2,
      city,
      state,
      pincode,
      country,
      isDefault: !!isDefault
    });

    if (process.env.LOG !== "false") {
      console.log("Address added", userId);
    }

    return res.status(201).json({
      message: "Address added successfully",
      address
    });
  } catch (error) {
    next(error);
  }
}

async function getAddresses(req, res, next) {
  try {
    const userId = req.user.id;
    console.log('[Address] Fetching addresses for user:', userId);

    const addresses = await Address.findAll({
      where: { userId },
      order: [["isDefault", "DESC"], ["createdAt", "DESC"]]
    });

    console.log('[Address] Found', addresses.length, 'addresses');

    return res.status(200).json(addresses);
  } catch (error) {
    console.error('[Address] Error fetching addresses:', error.message);
    next(error);
  }
}

async function updateAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const { id, line1, line2, city, state, pincode, country, isDefault } = req.body;

    const address = await Address.findOne({
      where: { id, userId }
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (isDefault === true) {
      await Address.update(
        { isDefault: false },
        { where: { userId } }
      );
    }

    if (line1 !== undefined) address.line1 = line1;
    if (line2 !== undefined) address.line2 = line2;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (pincode !== undefined) address.pincode = pincode;
    if (country !== undefined) address.country = country;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();

    if (process.env.LOG !== "false") {
      console.log("Address updated", userId, id);
    }

    return res.status(200).json({
      message: "Address updated successfully",
      address
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addAddress,
  getAddresses,
  updateAddress
};
