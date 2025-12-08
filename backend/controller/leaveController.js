// backend/controller/leaveController.js
const Leave = require("../model/leaveModel");
const User = require("../model/userModel");

const LeaveController = {
  // Apply for leave
  async applyLeave(req, res) {
    try {
      const { user_id, leave_type, start_date, end_date, reason } = req.body;

      // Validate required fields
      if (!user_id || !leave_type || !start_date || !end_date || !reason) {
        return res.status(400).json({
          error: "user_id, leave_type, start_date, end_date, and reason are required",
        });
      }

      // Validate leave type
      const validLeaveTypes = [
        "Casual Leave",
        "Sick Leave",
        "Annual Leave",
        "Maternity Leave",
      ];
      if (!validLeaveTypes.includes(leave_type)) {
        return res.status(400).json({ error: "Invalid leave type" });
      }

      // Check if user exists
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Validate dates
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);

      if (startDate >= endDate) {
        return res.status(400).json({
          error: "End date must be after start date",
        });
      }

      // Calculate number of days
      const timeDiff = endDate - startDate;
      const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

      // Create leave record
      const leave = await Leave.create({
        user_id,
        leave_type,
        start_date: startDate,
        end_date: endDate,
        reason,
        days,
        status: "Pending",
      });

      res.status(201).json({
        message: "Leave application submitted successfully",
        leave: leave.toJSON(),
      });
    } catch (err) {
      console.error("Error applying for leave:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get all leaves for a user
  async getUserLeaves(req, res) {
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

      const leaves = await Leave.findAll({
        where: { user_id },
        order: [["created_at", "DESC"]],
      });

      res.status(200).json(leaves);
    } catch (err) {
      console.error("Error fetching user leaves:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get all leaves (admin)
  async getAllLeaves(req, res) {
    try {
      const leaves = await Leave.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      res.status(200).json(leaves);
    } catch (err) {
      console.error("Error fetching leaves:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get leave by ID
  async getLeaveById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Leave ID is required" });
      }

      const leave = await Leave.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"],
          },
        ],
      });

      if (!leave) {
        return res.status(404).json({ error: "Leave not found" });
      }

      res.status(200).json(leave);
    } catch (err) {
      console.error("Error fetching leave:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update leave status (admin)
  async updateLeaveStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id || !status) {
        return res.status(400).json({
          error: "Leave ID and status are required",
        });
      }

      const validStatuses = ["Pending", "Approved", "Rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const leave = await Leave.findByPk(id);

      if (!leave) {
        return res.status(404).json({ error: "Leave not found" });
      }

      await leave.update({
        status,
        updated_at: new Date(),
      });

      res.status(200).json({
        message: "Leave status updated successfully",
        leave: leave.toJSON(),
      });
    } catch (err) {
      console.error("Error updating leave status:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete leave
  async deleteLeave(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Leave ID is required" });
      }

      const leave = await Leave.findByPk(id);

      if (!leave) {
        return res.status(404).json({ error: "Leave not found" });
      }

      // Only allow deletion if leave is still pending
      if (leave.status !== "Pending") {
        return res.status(400).json({
          error: "Can only delete pending leave applications",
        });
      }

      await leave.destroy();

      res.status(200).json({
        message: "Leave application deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting leave:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = LeaveController;
