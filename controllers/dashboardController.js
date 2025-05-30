const db = require("../config/db");

const formatCurrency = (value) => {
  const number =
    parseFloat((value || "0").toString().replace(/[^\d.-]/g, "")) || 0;
  return number.toLocaleString() + " $";
};

exports.getOverviewStats = async (req, res) => {
  try {
    const [employeeCount] = await db.execute(
      'SELECT COUNT(*) AS count FROM employees WHERE status = "active"'
    );
    const [vehicleCount] = await db.execute(
      "SELECT COUNT(*) AS count FROM vehicles"
    );
    const [totalSalaries] = await db.execute(
      "SELECT SUM(base_salary) AS total_salaries FROM salaries"
    );
    const [vehicleValues] = await db.execute(`
			SELECT 
				SUM(purchase_price) AS total_purchase_price, 
				SUM(market_price) AS total_market_price 
			FROM vehicles
		`);

    const cards = [
      {
        title: "Active Employees",
        value: employeeCount[0].count,
      },
      {
        title: "Vehicles",
        value: vehicleCount[0].count,
      },
      {
        title: "Total Salaries",
        value: formatCurrency(totalSalaries[0]?.total_salaries),
      },
      {
        title: "Total Purchase Price",
        value: formatCurrency(vehicleValues[0]?.total_purchase_price),
      },
      {
        title: "Total Market Price",
        value: formatCurrency(vehicleValues[0]?.total_market_price),
      },
    ];

    res.json({ cards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
