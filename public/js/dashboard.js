document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await api.get("dashboard/overview");
    const data = response.data;

    const overviewContainer = document.getElementById("overview");
    overviewContainer.innerHTML = "";

    data.cards.forEach((card) => {
      const cardDiv = document.createElement("div");
      cardDiv.className = `rounded-md p-6 text-gray-800 border dark:border-gray-700
        bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100
        shadow-sm hover:shadow-md transition-transform duration-300 ease-in-out
        hover:scale-105 flex flex-col items-center justify-center text-center h-64
        dark:from-yellow-900 dark:via-gray-800 dark:to-yellow-900 dark:text-yellow-200 dark:shadow-yellow-900/20`;

      const iconDiv = document.createElement("div");
      iconDiv.className = `bg-gray-300 dark:bg-yellow-400 text-3xl p-5 rounded-lg w-20 h-20 flex items-center justify-center
        shadow-sm dark:shadow-yellow-900/10 mb-5 text-gray-700 dark:text-gray-600`;

      const icon = document.createElement("i");
      icon.className = "fas ";

      switch (card.title) {
        case "Active Employees":
          icon.classList.add("fa-users");
          break;
        case "Vehicles":
          icon.classList.add("fa-car");
          break;
        case "Violations":
          icon.classList.add("fa-chart-line");
          break;
        case "Total Salaries":
          icon.classList.add("fa-money-bill-wave");
          break;
        default:
          icon.classList.add("fa-info-circle");
      }

      iconDiv.appendChild(icon);
      cardDiv.appendChild(iconDiv);

      const titleDiv = document.createElement("div");
      titleDiv.className = `text-sm uppercase font-semibold tracking-wide drop-shadow-sm
        text-gray-700 dark:text-yellow-300`;
      titleDiv.textContent = card.title;
      cardDiv.appendChild(titleDiv);

      const valueDiv = document.createElement("div");
      valueDiv.className = `text-3xl font-semibold mt-1 drop-shadow-sm text-gray-900 dark:text-yellow-100`;
      valueDiv.textContent = card.value;
      cardDiv.appendChild(valueDiv);

      overviewContainer.appendChild(cardDiv);
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
  }

  fetchVehicles();
  fetchTopBuyers();
});

async function fetchVehicles() {
  try {
    const { data } = await api.get("/vehicle/all");
    const vehicles = data.map((vehicle) => ({
      ...vehicle,
      createdAt: vehicle.created_at,
    }));

    const countsByMonth = getCountsLast6Months(vehicles);
    drawVehiclesLineChart(countsByMonth);
  } catch (error) {
    alert("Failed to load vehicles.");
    console.error(error);
  }
}

function getCountsLast6Months(vehicles) {
  const now = new Date();
  const months = [];
  const counts = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(
      d.toLocaleString("default", { month: "short", year: "numeric" })
    );
    counts.push(0);
  }

  vehicles.forEach((vehicle) => {
    const createdAt = new Date(vehicle.createdAt);
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      if (
        createdAt.getFullYear() === d.getFullYear() &&
        createdAt.getMonth() === d.getMonth()
      ) {
        counts[5 - i]++;
        break;
      }
    }
  });

  return { months, counts };
}

function drawVehiclesLineChart({ months, counts }) {
  const ctx = document.getElementById("vehiclesLineChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Vehicles Added",
          data: counts,
          borderColor: "rgba(99, 102, 241, 1)",
          backgroundColor: "rgba(99, 102, 241, 0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          precision: 0,
          ticks: { stepSize: 1 },
        },
      },
    },
  });
}

async function fetchTopBuyers() {
  try {
    const [{ data: employees }, { data: vehicles }] = await Promise.all([
      api.get("/employee/all"),
      api.get("/vehicle/all"),
    ]);

    const purchaseCounts = vehicles.reduce((acc, vehicle) => {
      const buyerId = vehicle.buyer_id;
      if (buyerId) {
        acc[buyerId] = (acc[buyerId] || 0) + 1;
      }
      return acc;
    }, {});

    const employeesWithCounts = employees.map((emp) => ({
      ...emp,
      purchaseCount: purchaseCounts[emp.id] || 0,
    }));

    employeesWithCounts.sort((a, b) => b.purchaseCount - a.purchaseCount);

    const top5 = employeesWithCounts.slice(0, 5);

    drawTopBuyersChart(top5);
  } catch (error) {
    alert("Failed to load top buyers.");
    console.error(error);
  }
}

function drawTopBuyersChart(employees) {
  const ctx = document.getElementById("lineChart").getContext("2d");
  const labels = employees.map((emp) => `${emp.first_name} ${emp.last_name}`);
  const dataCounts = employees.map((emp) => emp.purchaseCount);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Number of Vehicles Purchased",
          data: dataCounts,
          backgroundColor: "rgba(99, 102, 241, 0.7)",
          borderColor: "rgba(99, 102, 241, 1)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          precision: 0,
          ticks: { stepSize: 1 },
        },
      },
    },
  });
}
