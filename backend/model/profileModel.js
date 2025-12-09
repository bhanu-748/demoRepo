const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./userModel");

const Profile = sequelize.define(
  "Profile",
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
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergency_contact_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergency_contact_phone: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: "profiles",
    timestamps: false,
  }
);

User.hasOne(Profile, { foreignKey: "user_id", onDelete: "CASCADE" });
Profile.belongsTo(User, { foreignKey: "user_id" });

module.exports = Profile;
