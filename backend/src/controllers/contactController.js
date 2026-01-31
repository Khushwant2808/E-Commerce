const { SupportMessage, User } = require("../models");

const submitMessage = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { subject, message } = req.body;

        if (!subject || !message) {
            return res.status(400).json({ message: "Subject and message are required" });
        }

        const newMessage = await SupportMessage.create({
            userId,
            subject,
            message
        });

        return res.status(201).json({
            message: "Support message submitted successfully",
            data: newMessage
        });
    } catch (error) {
        next(error);
    }
};

const getMyMessages = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const messages = await SupportMessage.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]]
        });

        return res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};

// Admin only: Get all messages
const getAllMessages = async (req, res, next) => {
    try {
        const messages = await SupportMessage.findAll({
            include: [{ model: User, attributes: ["name", "email"] }],
            order: [["createdAt", "DESC"]]
        });

        return res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    submitMessage,
    getMyMessages,
    getAllMessages
};
