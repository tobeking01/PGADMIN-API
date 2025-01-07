// routes/chatRoutes.js
const express = require("express");
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");
const { check } = require("express-validator");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const sendMessageLimiter = rateLimit({
  windowMs: 1000, // 1 second window
  max: 5, // limit each IP to 5 requests per windowMs
  message: { message: "Too many messages sent. Please try again later." },
});

// Get messages between two users
router.get("/:userId", authMiddleware, chatController.getMessages);

// Send a message
router.post(
  "/",
  authMiddleware,
  sendMessageLimiter,
  [
    check("receiverId", "Receiver ID is required").notEmpty(),
    check("message", "Message cannot be empty").notEmpty(),
  ],
  chatController.sendMessage
);

module.exports = router;
