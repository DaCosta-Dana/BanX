// Data for Spending by Category
const spendingCategoryData = {
    labels: ["Food", "Utilities", "Entertainment", "Transport", "Uncategorized"],
    datasets: [{
        label: "Spending by Category",
        data: [500, 300, 150, 200, 50],
        backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)"
        ],
        borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)"
        ],
        borderWidth: 1
    }]
};

// Data for Spending Trend
const spendingTrendData = {
    labels: ["June", "July", "August", "September", "October", "November"],
    datasets: [{
        label: "Spending Trend",
        data: [2000, 1800, 2500, 2200, 2400, 2800],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: true
    }]
};

// Chart.js Configuration
const options = {
    responsive: false, // Disable responsiveness
    maintainAspectRatio: false, // Prevent automatic resizing
    plugins: {
        legend: {
            position: "top"
        }
    }
};

// Fetch and update the spending by category data from the backend
async function fetchSpendingByCategory(username) {
  try {
    const response = await fetch(`/transactions/spendingByCategory/${username}`);
    if (!response.ok) {
      throw new Error('Failed to fetch spending by category');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching spending by category:', error);
    return {};
  }
}

async function updateSpendingCategoryChart() {
  const username = await fetchUsername();
  const spendingByCategory = await fetchSpendingByCategory(username);

  const labels = Object.keys(spendingByCategory);
  const data = Object.values(spendingByCategory);

  const spendingCategoryData = {
    labels,
    datasets: [{
      label: "Spending by Category",
      data,
      backgroundColor: [
        "rgba(255, 99, 132, 0.5)",
        "rgba(54, 162, 235, 0.5)",
        "rgba(255, 206, 86, 0.5)",
        "rgba(75, 192, 192, 0.5)",
        "rgba(153, 102, 255, 0.5)"
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)"
      ],
      borderWidth: 1
    }]
  };

  const ctx1 = document.getElementById("spendingCategoryChart").getContext("2d");
  new Chart(ctx1, {
    type: "pie",
    data: spendingCategoryData,
    options: options
  });
}

// Render Charts
window.onload = () => {
    const ctx2 = document.getElementById("spendingTrendChart").getContext("2d");

    new Chart(ctx2, {
        type: "line",
        data: spendingTrendData,
        options: options
    });
};

document.addEventListener('DOMContentLoaded', async () => {
  await updateSpendingCategoryChart();
});