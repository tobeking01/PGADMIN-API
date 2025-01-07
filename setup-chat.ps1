# Define folders
$folders = @(
    "controllers",
    "models",
    "routes"
)

# Create folders
foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -Path $folder -ItemType Directory | Out-Null
    }
}

# Create chatController.js
Set-Content -Path "controllers\chatController.js" -Value @'
const Chat = require("../models/chatModel");

// Fetch messages between two users
exports.getMessages = async (req, res) => {
  const { userId } = req.params;
  const { id: currentUserId } = req.user;

  try {
    const messages = await Chat.getMessages(currentUserId, userId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  const { receiverId, message } = req.body;
  const { id: senderId } = req.user;

  try {
    const newMessage = await Chat.sendMessage(senderId, receiverId, message);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
'@

# Create chatModel.js
Set-Content -Path "models\chatModel.js" -Value @'
const db = require("../config/db");

class Chat {
  static async getMessages(senderId, receiverId) {
    try {
      const result = await db.query(
        `SELECT * FROM messages
         WHERE (sender_id = $1 AND receiver_id = $2)
         OR (sender_id = $2 AND receiver_id = $1)
         ORDER BY timestamp ASC`,
        [senderId, receiverId]
      );
      return result.rows;
    } catch (error) {
      throw new Error("Could not fetch messages.");
    }
  }

  static async sendMessage(senderId, receiverId, message) {
    try {
      const result = await db.query(
        `INSERT INTO messages (sender_id, receiver_id, message)
         VALUES ($1, $2, $3) RETURNING *`,
        [senderId, receiverId, message]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Could not send message.");
    }
  }
}

module.exports = Chat;
'@

# Create chatRoutes.js
Set-Content -Path "routes\chatRoutes.js" -Value @'
const express = require("express");
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/:userId", authMiddleware, chatController.getMessages);
router.post("/", authMiddleware, chatController.sendMessage);

module.exports = router;
'@

Write-Host "Chat feature setup complete."