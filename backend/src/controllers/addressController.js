const { Address, User} = require("../models");

async function addAddress(req, res) {
  try {
    const userId = req.user.id;
    const { line1, line2, city, state, pincode, country, isDefault } = req.body;

    if (!line1 || !city || !state || !pincode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

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
    await User.update(
        { addressProvided: true },
        { where: { id: userId }}
    )

    if (process.env.LOG !== "false") {
      console.log("Address added", userId);
    }

    return res.status(201).json({
      message: "Address added successfully",
      address
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getAddresses(req, res) {
  try {
    const userId = req.user.id;

    const addresses = await Address.findAll({
      where: { userId },
      order: [["isDefault", "DESC"], ["createdAt", "DESC"]]
    });

    if (!addresses.length) {
      return res.status(404).json({ message: "No addresses found" });
    }

    if (process.env.LOG !== "false") {
      console.log("Addresses fetched", userId);
    }

    return res.status(200).json(addresses);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function updateAddress(req, res) {
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
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  addAddress,
  getAddresses,
  updateAddress
};
