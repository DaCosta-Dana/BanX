// Sample data for transactions, balance, and spending
const sampleData = {
    username: "Shelly J.",
    balance: 10500.00,
    spending: {
        current: 380.00,
        limit: 1000.00
    },
    savingsGrowth: 6.79,
    transactions: [
        { name: "Bitcoin Transactions", date: "Jan 16, 2020", account: "****45242", amount: -853.00, status: "Success" },
        { name: "Sent to Antonia", date: "Jan 16, 2020", account: "****87212", amount: -153.00, status: "Pending" },
        { name: "Withdraw Paypal", date: "Jan 16, 2020", account: "****36275", amount: +223.00, status: "Success" }
    ]
};

// Function to update the username
function updateUsername() {
    document.getElementById("username").textContent = sampleData.username;
}

// Function to update the balance
function updateBalance() {
    const balanceElement = document.getElementById("total-balance");
    balanceElement.textContent = `€${sampleData.balance.toFixed(2)}`;
}

// Function to update the spending limit
function updateSpendingLimit() {
    const spendingLimitInfo = document.getElementById("spending-limit-info");
    const spendingProgress = document.getElementById("spending-progress");

    // Calculate percentage
    const percentage = (sampleData.spending.current / sampleData.spending.limit) * 100;
    spendingLimitInfo.textContent = `€${sampleData.spending.current.toFixed(2)} out of €${sampleData.spending.limit.toFixed(2)}`;
    spendingProgress.style.width = `${percentage}%`;
}

// Function to update the savings growth
function updateSavingsGrowth() {
    const growthElement = document.getElementById("savings-growth");
    growthElement.textContent = `+${sampleData.savingsGrowth.toFixed(2)}%`;
}

// Function to populate the transactions list
function updateTransactions() {
    const transactionList = document.getElementById("transaction-list");
    transactionList.innerHTML = ""; // Clear existing transactions

    sampleData.transactions.forEach(transaction => {
        const transactionItem = document.createElement("li");
        transactionItem.innerHTML = `
            <span>${transaction.name}</span>
            <span>${transaction.date}</span>
            <span>${transaction.account}</span>
            <span>€${transaction.amount.toFixed(2)}</span>
            <span class="status ${transaction.status.toLowerCase()}">${transaction.status}</span>
        `;
        transactionList.appendChild(transactionItem);
    });
}

// Initialise all dynamic data on page load
function initialiseDashboard() {
    updateUsername();
    updateBalance();
    updateSpendingLimit();
    updateSavingsGrowth();
    updateTransactions();
}

// Call initialiseDashboard to load data on page load
document.addEventListener("DOMContentLoaded", initialiseDashboard);