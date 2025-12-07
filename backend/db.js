// backend/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: "postgres",
    logging: false, // Set to console.log to see SQL queries
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to PostgreSQL using Sequelize");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL:", err.message);
  });

module.exports = sequelize;
