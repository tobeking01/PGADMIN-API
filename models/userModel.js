// models/userModel.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  // Method to create a new user
  static async createUser(username, email, password) {
    try {
      const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await db.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
        [username, email, hashedPassword]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new Error('Could not create user. Please try again later.');
    }
  }

  // Method to find a user by email
  static async findByEmail(email) {
    try {
      const result = await db.query(
        "SELECT id, username, email, password FROM users WHERE email = $1",
        [email]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error finding user by email:", error.message);
      throw new Error("Could not retrieve user by email. Please try again later.");
    }
  }
  
  // Ensure sensitive fields like 'password' are not returned to the client
  static async findById(id) {
    try {
      const result = await db.query(
        "SELECT id, username, email FROM users WHERE id = $1",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error finding user by ID:", error.message);
      throw new Error("Could not retrieve user by ID. Please try again later.");
    }
  }
}

module.exports = User;
