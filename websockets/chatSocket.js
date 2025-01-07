// websockets/chatSocket.js
const Chat = require("../models/chatModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (io) => {
  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      console.error("No token provided for WebSocket connection");
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check for token expiry
      if (Date.now() >= decoded.exp * 1000) {
        console.error("Token expired for WebSocket connection");
        return next(new Error("Token expired"));
      }

      socket.user = decoded.user; // Attach user info to the socket
      next();
    } catch (err) {
      console.error("WebSocket authentication error:", err.message);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.user.id);

    // Join the user to a room identified by their user ID
    socket.join(socket.user.id.toString());

    // Handle incoming messages
    socket.on("send_message", async (data, callback) => {
      const { receiverId, message } = data;
      const senderId = socket.user.id;

      try {
        // Save message to the database
        const newMessage = await Chat.sendMessage(senderId, receiverId, message);

        // Emit message to the receiver
        io.to(receiverId.toString()).emit("receive_message", newMessage);

        // Optionally, emit acknowledgment back to the sender
        callback({ status: "delivered", message: newMessage });
      } catch (error) {
        console.error("Error sending message via WebSocket:", error.message);
        callback({ status: "error", message: "Failed to send message." });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.id);
    });
  });
};