// backend/router/profileRouter.js
const express = require("express");
const router = express.Router();

const ProfileController = require("../controller/profileController");

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Profile router working!" });
});

// GET profile by user id
router.get("/user/:id", ProfileController.getUserProfile);

// POST create/update profile
router.post("/", ProfileController.upsertProfile);

module.exports = router;
