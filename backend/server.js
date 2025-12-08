// backend/server.js
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const userRouter = require("./router/userRouter");
const leaveRouter = require("./router/leaveRouter");
const timesheetRouter = require("./router/timesheetRouter");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRouter);
app.use("/api/leaves", leaveRouter);
app.use("/api/timesheets", timesheetRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});


// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
