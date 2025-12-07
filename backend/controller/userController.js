// backend/controller/userController.js
const bcrypt = require("bcrypt");
const User = require("../model/userModel");

const UserController = {
  // Create a new user
  async createUser(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({ 
          error: "Name, email, and password are required" 
        });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Create user in database
      const user = await User.create({
        name,
        email,
        password_hash,
      });

      // Return the created user
      res.status(201).json(user.toJSON());
    } catch (err) {
      console.error("Error creating user:", err);

      // Handle unique email error
      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ error: "Email already exists" });
      }

      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: ["id", "name", "email", "created_at"],
      });
      res.status(200).json(users);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const user = await User.findByPk(id, {
        attributes: ["id", "name", "email", "created_at"],
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user.toJSON());
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      if (!id || !name || !email) {
        return res.status(400).json({ 
          error: "User ID, name, and email are required" 
        });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await user.update({
        name,
        email,
      });

      res.status(200).json(user.toJSON());
    } catch (err) {
      console.error("Error updating user:", err);

      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ error: "Email already exists" });
      }

      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await user.destroy();

      res.status(200).json({ message: "User deleted successfully", id: user.id });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Login user
  async loginUser(req, res) {
    try {
        

      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required fields" });
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const valid = await require("bcrypt").compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      // Return user info (without password)
      const { id, name, email: userEmail, created_at } = user;
      res.status(200).json({ id, name, email: userEmail, created_at });
    } catch (err) {
      console.error("Error logging in:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = UserController;
