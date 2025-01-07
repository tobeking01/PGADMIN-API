// controllers/chatController.js
const Chat = require("../models/chatModel");
const { validationResult } = require("express-validator");

// Fetch messages between two users
exports.getMessages = async (req, res) => {
  const { userId } = req.params;
  const { id: currentUserId } = req.user;

  try {
    const messages = await Chat.getMessages(currentUserId, userId);
    res.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { receiverId, message } = req.body;
  const { id: senderId } = req.user;

  try {
    const newMessage = await Chat.sendMessage(senderId, receiverId, message);
    res.status(201).json({ message: newMessage });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
