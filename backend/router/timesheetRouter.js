// backend/router/timesheetRouter.js
const express = require("express");
const TimesheetController = require("../controller/timesheetController");

const router = express.Router();

// Submit timesheet
router.post("/submit", TimesheetController.submitTimesheet);

// Get all timesheets for a user
router.get("/user/:user_id", TimesheetController.getUserTimesheets);

// Get all timesheets (admin)
router.get("/", TimesheetController.getAllTimesheets);

// Get timesheet by ID
router.get("/:id", TimesheetController.getTimesheetById);

// Get timesheets by date range (admin)
router.get("/range/query", TimesheetController.getTimesheetsByDateRange);

// Update timesheet status (admin)
router.put("/:id/status", TimesheetController.updateTimesheetStatus);

// Delete timesheet
router.delete("/:id", TimesheetController.deleteTimesheet);

module.exports = router;
