// Example transaction data
const transactions = [
    { date: "2024-11-10", description: "Grocery Store", amount: -75.50, status: "Completed" },
    { date: "2024-11-12", description: "Utility Bill Payment", amount: -150.00, status: "Completed" },
    { date: "2024-11-14", description: "Salary Deposit", amount: 2000.00, status: "Completed" },
];

const transactionData = document.getElementById("recent-transaction-data");
const noRecentTransactionsMessage = document.getElementById("no-recent-transactions-message");

// Populate transaction table
function renderTransactions() {
    transactionData.innerHTML = "";
    if (transactions.length === 0) {
        noRecentTransactionsMessage.style.display = "block";
    } else {
        noRecentTransactionsMessage.style.display = "none";
        transactions.forEach(transaction => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                <td>${transaction.amount < 0 ? "-" : ""}$${Math.abs(transaction.amount).toFixed(2)}</td>
                <td>${transaction.status}</td>
            `;
            transactionData.appendChild(row);
        });
    }
}

renderTransactions();

// Dummy functions for settings
function editPersonalInfo() {
    alert("Personal Info Edit functionality coming soon!");
}

function resetPassword() {
    alert("Password reset functionality coming soon!");
}

function updateNotifications() {
    alert("Notification update functionality coming soon!");
}