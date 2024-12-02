function redirectToPayment() {
    window.location.href = "payment.html";
}

function redirectToDashboard() {
    window.location.href = "homepage.html";
}

function redirectToAnalytics() {
    window.location.href = "analytics.html";
}

function redirectToMyAccount() {
    window.location.href = "myAccount.html";
}

function redirectToSettings() {
    window.location.href = "settings.html";
}

async function updateUsername() {
    const username = await fetchUsername();
    const usernameElement = document.getElementById("username")
    usernameElement.textContent = username;
}

async function fetchUsername() {
    try {
        const response = await fetch('/utilisateurs/username');
        if (!response.ok) {
            throw new Error('Failed to fetch username');
        }
        const data = await response.json();
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
        
        return data.balance;
    } catch (error) {
        console.error('Error fetching balance:', error);
        return 0;
    }
}

// Function to update the balance
async function updateBalance() {
    const username = await fetchUsername();
    const balance = await fetchBalance(username);
    const balanceElement = document.getElementById("total-balance");
    balanceElement.textContent = `€${balance.toFixed(2)}`;
}

async function fetchTransactions(username) {
    try {
        const response = await fetch(`/transactions/userTransactions/${username}`);
        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

async function updateTransactions() {
    const username = await fetchUsername();
    const transactions = await fetchTransactions(username);
    const transactionTableBody = document.getElementById("transaction-data");

    // Clear existing rows
    transactionTableBody.innerHTML = "";

    // Sort transactions by date in descending order
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Populate table rows
    transactions.forEach(transaction => {
        const transactionRow = document.createElement("tr");
        transactionRow.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td> ${transaction.beneficiary_account}</td>
            <td>${transaction.transactionName}</td>
            <td>€${transaction.amount.toFixed(2)}</td>
            <td>${transaction.category}</td>
        `;
        transactionTableBody.appendChild(transactionRow);
    });
}

// Initialise all dynamic data on page load
function initialiseDashboard() {
    updateBalance();
    updateUsername();
    updateTransactions();
}

// Call initialiseDashboard to load data on page load
document.addEventListener("DOMContentLoaded", initialiseDashboard);