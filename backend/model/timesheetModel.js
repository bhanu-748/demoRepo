// backend/model/timesheetModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./userModel");

const Timesheet = sequelize.define(
  "Timesheet",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    project: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hours_worked: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Submitted",
      enum: ["Submitted", "Approved", "Rejected"],
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "timesheets",
    timestamps: false,
  }
);

// Association with User
User.hasMany(Timesheet, { foreignKey: "user_id", onDelete: "CASCADE" });
Timesheet.belongsTo(User, { foreignKey: "user_id" });

module.exports = Timesheet;
