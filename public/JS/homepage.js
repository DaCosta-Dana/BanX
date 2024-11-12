// Function to update the username
/* 
function updateUsername() {
    document.getElementById("username").textContent = sampleData.username;
}

// Function to update the balance
function updateBalance() {
    const balanceElement = document.getElementById("total-balance");
    balanceElement.textContent = `€${sampleData.balance.toFixed(2)}`;
}

 */
async function fetchUsername() {
    try {
        const response = await fetch('/utilisateurs/username');
        if (!response.ok) {
            throw new Error('Failed to fetch username');
        }
        const data = await response.json();
        alert(data.username);
        return data.username;
    } catch (error) {
        console.error('Error fetching username:', error);
        return null;
    }
}



// Function to fetch balance from the backend
async function fetchBalance(username) {
    try {
        const response = await fetch(`/utilisateurs/balance/${username}`);
        console.log('Response status:', response.status);
        if (!response.ok) {
            alert("Error fetching balance");
            throw new Error('Failed to fetch balance');
        }
        const data = await response.json();
        console.log('Response data:', data);
        alert(data);
        return data.balance;
    } catch (error) {
        console.error('Error fetching balance:', error);
        return 1293439200;
    }
}

// Function to update the balance
async function updateBalance() {
    const username = await fetchUsername();
    const balance = await fetchBalance(username);
    const balanceElement = document.getElementById("total-balance");
    alert(balance);
    balanceElement.textContent = `€${balance.toFixed(2)}`;
}

/*  
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
 */
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
    updateBalance();
}

// Call initialiseDashboard to load data on page load
document.addEventListener("DOMContentLoaded", initialiseDashboard);