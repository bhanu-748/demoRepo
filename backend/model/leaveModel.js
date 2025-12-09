// backend/model/leaveModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./userModel");

const Leave = sequelize.define(
  "Leave",
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
    leave_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    days: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Pending",
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
    tableName: "leaves",     // MUST MATCH DB
    freezeTableName: true,   // 💥 STOP SEQUELIZE FROM CHANGING CASE/PLURAL
    timestamps: false,
  }
);

// Associations
User.hasMany(Leave, { foreignKey: "user_id", onDelete: "CASCADE" });
Leave.belongsTo(User, { foreignKey: "user_id" });

module.exports = Leave;
