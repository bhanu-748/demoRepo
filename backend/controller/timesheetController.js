// backend/controller/timesheetController.js
const Timesheet = require("../model/timesheetModel");
const User = require("../model/userModel");

const TimesheetController = {
  // Submit timesheet
  async submitTimesheet(req, res) {
    try {
      const { user_id, date, project, hours_worked, description } = req.body;

      // Validate required fields
      if (!user_id || !date || !project || hours_worked === undefined) {
        return res.status(400).json({
          error: "user_id, date, project, and hours_worked are required",
        });
      }

      // Validate hours worked
      const hours = parseFloat(hours_worked);
      if (isNaN(hours) || hours < 0 || hours > 24) {
        return res.status(400).json({
          error: "hours_worked must be between 0 and 24",
        });
      }

      // Check if user exists
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Validate date
      const timesheetDate = new Date(date);
      if (isNaN(timesheetDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      // Create timesheet record
      const timesheet = await Timesheet.create({
        user_id,
        date: timesheetDate,
        project,
        hours_worked: hours,
        description: description || null,
        status: "Submitted",
      });

      res.status(201).json({
        message: "Timesheet submitted successfully",
        timesheet: timesheet.toJSON(),
      });
    } catch (err) {
      console.error("Error submitting timesheet:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get all timesheets for a user
  async getUserTimesheets(req, res) {
    try {
      const { user_id } = req.params;

      if (!user_id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Check if user exists
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const timesheets = await Timesheet.findAll({
        where: { user_id },
        order: [["date", "DESC"]],
      });

      res.status(200).json(timesheets);
    } catch (err) {
      console.error("Error fetching user timesheets:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get all timesheets (admin)
  async getAllTimesheets(req, res) {
    try {
      const timesheets = await Timesheet.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"],
          },
        ],
        order: [["date", "DESC"]],
      });

      res.status(200).json(timesheets);
    } catch (err) {
      console.error("Error fetching timesheets:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get timesheet by ID
  async getTimesheetById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Timesheet ID is required" });
      }

      const timesheet = await Timesheet.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"],
          },
        ],
      });

      if (!timesheet) {
        return res.status(404).json({ error: "Timesheet not found" });
      }

      res.status(200).json(timesheet);
    } catch (err) {
      console.error("Error fetching timesheet:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update timesheet status (admin)
  async updateTimesheetStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id || !status) {
        return res.status(400).json({
          error: "Timesheet ID and status are required",
        });
      }

      const validStatuses = ["Submitted", "Approved", "Rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const timesheet = await Timesheet.findByPk(id);

      if (!timesheet) {
        return res.status(404).json({ error: "Timesheet not found" });
      }

      await timesheet.update({
        status,
        updated_at: new Date(),
      });

      res.status(200).json({
        message: "Timesheet status updated successfully",
        timesheet: timesheet.toJSON(),
      });
    } catch (err) {
      console.error("Error updating timesheet status:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete timesheet
  async deleteTimesheet(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Timesheet ID is required" });
      }

      const timesheet = await Timesheet.findByPk(id);

      if (!timesheet) {
        return res.status(404).json({ error: "Timesheet not found" });
      }

      // Only allow deletion if timesheet is still submitted
      if (timesheet.status !== "Submitted") {
        return res.status(400).json({
          error: "Can only delete submitted timesheets",
        });
      }

      await timesheet.destroy();

      res.status(200).json({
        message: "Timesheet deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting timesheet:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get timesheets for a date range (admin)
  async getTimesheetsByDateRange(req, res) {
    try {
      const { start_date, end_date, user_id } = req.query;

      if (!start_date || !end_date) {
        return res.status(400).json({
          error: "start_date and end_date are required",
        });
      }

      const query = {
        date: {
          [require("sequelize").Op.between]: [
            new Date(start_date),
            new Date(end_date),
          ],
        },
      };
      
      if (user_id) {
        query.user_id = user_id;
      }

      const timesheets = await Timesheet.findAll({
        where: query,
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"],
          },
        ],
        order: [["date", "DESC"]],
      });

      res.status(200).json(timesheets);
    } catch (err) {
      console.error("Error fetching timesheets by date range:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = TimesheetController;
