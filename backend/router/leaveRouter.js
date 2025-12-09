// backend/router/leaveRouter.js
const express = require("express");
const LeaveController = require("../controller/leaveController");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Leave router working!" });
});


// Apply for leave
router.post("/apply", LeaveController.applyLeave);

// Get all leaves for a user
router.get("/user/:user_id", LeaveController.getUserLeaves);

// Get all leaves (admin)
router.get("/", LeaveController.getAllLeaves);

// Get leave by ID
router.get("/:id", LeaveController.getLeaveById);

// Update leave status (admin)
router.put("/:id/status", LeaveController.updateLeaveStatus);

// Delete leave
router.delete("/:id", LeaveController.deleteLeave);

module.exports = router;
