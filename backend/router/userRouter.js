// backend/router/userRouter.js
const express = require("express");
const UserController = require("../controller/userController");

const router = express.Router();

// Create a new user
router.post("/", UserController.createUser);

// Get all users
router.get("/", UserController.getAllUsers);


// Get user by ID
router.get("/:id", UserController.getUserById);

// Update user
router.put("/:id", UserController.updateUser);

// Delete user
router.delete("/:id", UserController.deleteUser);

// Login user
router.post("/login", require("../controller/userController").loginUser);

module.exports = router;
