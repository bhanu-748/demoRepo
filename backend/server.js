const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRouter = require("./router/userRouter");
const leaveRouter = require("./router/leaveRouter");
const timesheetRouter = require("./router/timesheetRouter");
const profileRouter = require("./router/profileRouter");

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes ONCE
app.use("/api/users", userRouter);
app.use("/api/leaves", leaveRouter);
app.use("/api/timesheets", timesheetRouter);
app.use("/api/profile", profileRouter);

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ message: "Server healthy" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
