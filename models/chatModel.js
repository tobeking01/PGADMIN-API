// models/chatModel.js
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
      console.error("Error fetching messages:", error.message);
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
      console.error("Error sending message:", error.message);
      throw new Error("Could not send message.");
    }
  }
}

module.exports = Chat;
