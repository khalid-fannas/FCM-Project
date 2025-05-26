const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");

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

const { verifyToken } = require("./middlewares/authMiddleware.js");

app.get("/dashboard", verifyToken, (req, res) => {
  const cards = [
    {
      title: "Total Employees",
      value: "120",
      icon: "faUsers",
      bgColor: "bg-violet-600",
      color: "text-violet-500",
    },
    {
      title: "Sales",
      value: "$230,000",
      icon: "faMoneyBillWave",
      bgColor: "bg-amber-500",
      color: "text-amber-500",
    },
    {
      title: "Profit",
      value: "$80,000",
      icon: "faChartLine",
      bgColor: "bg-sky-400",
      color: "text-sky-500",
    },
    {
      title: "Bonuses",
      value: "$15,000",
      icon: "faGift",
      bgColor: "bg-yellow-300",
      color: "text-yellow-500",
    },
    {
      title: "Vehicles",
      value: "34",
      icon: "faCar",
      bgColor: "bg-red-400",
      color: "text-red-500",
    },
  ];

  const rawSalesData = [
    { name: "John", sales: 9765 },
    { name: "Sarah", sales: 3789 },
    { name: "Ali", sales: 2356 },
    { name: "Jane", sales: 6868 },
    { name: "Omar", sales: 5778 },
    { name: "Ahmed", sales: 9100 },
    { name: "Lisa", sales: 9000 },
    { name: "Mohamed", sales: 6323 },
    { name: "Emily", sales: 9654 },
    { name: "Khalid", sales: 8200 },
    { name: "Noor", sales: 5123 },
    { name: "Hassan", sales: 6897 },
    { name: "Mona", sales: 7345 },
    { name: "Zain", sales: 8456 },
    { name: "Layla", sales: 9231 },
  ];

  const top10Employees = rawSalesData
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10);

  const monthlySalesData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    data: [
      12000, 15000, 10000, 18000, 16000, 14000, 17000, 19000, 13500, 15500,
      17500, 20000,
    ],
  };

  res.render("dashboard", { cards, top10Employees, monthlySalesData });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
