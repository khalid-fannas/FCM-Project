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
    1200, 1900, 3000, 2500, 3200, 2800, 4000, 3500, 4200, 4600, 3900, 5000,
  ],
};

const weeklyRevenueData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  data: [500, 700, 900, 800, 1200, 1100, 1000],
};

function getChartColors() {
  const isDarkMode = document.documentElement.classList.contains("dark");
  return {
    backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
    borderColor: isDarkMode ? "#4b5563" : "#e5e7eb",
    gridColor: isDarkMode ? "#374151" : "#e5e7eb",
    axisTextColor: isDarkMode ? "#d1d5db" : "#374151",
    legendTextColor: isDarkMode ? "#e5e7eb" : "#374151",
  };
}
const doughnutChartCtx = document
  .getElementById("doughnutChart")
  .getContext("2d");
const barColors = getChartColors();
const doughnutChart = new Chart(doughnutChartCtx, {
  type: "bar",
  data: {
    labels: monthlySalesData.labels,
    datasets: [
      {
        label: "Monthly Sales ($)",
        data: monthlySalesData.data,
        backgroundColor: [
          "#ef4444",
          "#ec4899",
          "#8b5cf6",
          "#7c3aed",
          "#6366f1",
          "#3b82f6",
          "#0ea5e9",
          "#06b6d4",
          "#14b8a6",
          "#22c55e",
          "#84cc16",
          "#eab308",
        ],
        borderColor: barColors.borderColor,
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: barColors.axisTextColor,
          font: { size: 14, weight: "600", family: "'Inter', sans-serif" },
        },
        grid: { color: "transparent" },
      },
      y: {
        ticks: {
          color: barColors.axisTextColor,
          font: { size: 14, weight: "600", family: "'Inter', sans-serif" },
        },
        grid: { color: barColors.gridColor },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: barColors.legendTextColor,
        },
      },
    },
  },
});

const lineChartCtx = document.getElementById("lineChart").getContext("2d");
const lineColors = getChartColors();
const lineChart = new Chart(lineChartCtx, {
  type: "line",
  data: {
    labels: weeklyRevenueData.labels,
    datasets: [
      {
        label: "Weekly Revenue ($)",
        data: weeklyRevenueData.data,
        fill: false,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.3,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: lineColors.axisTextColor,
          font: { size: 14, weight: "600", family: "'Inter', sans-serif" },
        },
        grid: { color: "transparent" },
      },
      y: {
        ticks: {
          color: lineColors.axisTextColor,
          font: { size: 14, weight: "600", family: "'Inter', sans-serif" },
        },
        grid: { color: lineColors.gridColor },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: lineColors.legendTextColor,
        },
      },
    },
  },
});

function updateChartColors(chart, colors) {
  chart.data.datasets.forEach((dataset) => {
    dataset.borderColor = colors.borderColor;
  });

  if (chart.config.type === "bar") {
    chart.options.scales.x.ticks.color = colors.axisTextColor;
    chart.options.scales.y.ticks.color = colors.axisTextColor;
    chart.options.scales.y.grid.color = colors.gridColor;
  } else if (chart.config.type === "line") {
    chart.options.scales.x.ticks.color = colors.axisTextColor;
    chart.options.scales.y.ticks.color = colors.axisTextColor;
    chart.options.scales.y.grid.color = colors.gridColor;
  }

  chart.options.plugins.legend.labels.color = colors.legendTextColor;
  chart.update();
}

const observer = new MutationObserver(() => {
  const newColors = getChartColors();
  updateChartColors(doughnutChart, newColors);
  updateChartColors(lineChart, newColors);
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["class"],
});
