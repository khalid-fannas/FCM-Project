const express = require("express");
require("dotenv").config();
var cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT;

const employeeRouter = require("./routes/employeeRouter");
const salaryRouter = require("./routes/salaryRouter");
const shiftRouter = require("./routes/shiftRouter");
const vehicleRouter = require("./routes/vehicleRouter");
const bonusRoutes = require("./routes/bonusRoutes");
const deductionRoutes = require("./routes/deductionRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const violationRoutes = require("./routes/violationRoutes");
const violationsEmployeeRecordRoutes = require("./routes/violationsEmployeeRecordRoutes");
const lateEntryRoutes = require("./routes/lateEntryRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/employee", employeeRouter);

app.use("/api/salary", salaryRouter);

app.use("/api/shift", shiftRouter);

app.use("/api/vehicle", vehicleRouter);

app.use("/api/bonus", bonusRoutes);

app.use("/api/deduction", deductionRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/violation", violationRoutes);

app.use("/api/violationsRecord", violationsEmployeeRecordRoutes);

app.use("/api/lateEntry", lateEntryRoutes);

app.use("/api/user", userRoutes);

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
