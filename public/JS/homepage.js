// ========== Redirection Function ==========

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

function redirectToSupport() {
    window.location.href = "support.html";
}

// ========== Function ==========

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

async function fetchFirstname(username) {
    try {
        const response = await fetch(`/utilisateurs/firstname/${username}`);
        console.log('Response status:', response.status);
        if (!response.ok) {
            alert("Error fetching firstname");
            throw new Error('Failed to fetch firstname');
        }
        const data = await response.json();
        console.log('Response data:', data);
        
        return data.firstname;
    } catch (error) {
        console.error('Error fetching firstname:', error);
        return 0;
    }
}

async function updateFirstname() {
    const username = await fetchUsername();
    const firstname = await fetchFirstname(username);
    const balanceElement = document.getElementById("username");
    balanceElement.textContent = firstname;
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

async function updateTransactionsDashboard() {
    const username = await fetchUsername();
    const transactions = await fetchTransactions(username);
    const transactionTableBody = document.getElementById("transaction-data");

    // Clear existing rows
    transactionTableBody.innerHTML = "";

    // Sort transactions by date in descending order
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Get the last 3 transactions
    const recentTransactions = transactions.slice(0, 3);

    // Populate table rows
    recentTransactions.forEach(transaction => {
        const transactionRow = document.createElement("tr");
        const isSender = transaction.sender_account === username;
        const amount = isSender ? `- €${transaction.amount.toFixed(2)}` : `+ €${transaction.amount.toFixed(2)}`;
        const amountClass = isSender ? 'amount-red' : 'amount-green';
        transactionRow.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${isSender ? transaction.beneficiary_account : transaction.sender_account}</td>
            <td>${transaction.transactionName}</td>
            <td class="${amountClass}">${amount}</td>
            <td>${transaction.category}</td>
        `;
        transactionTableBody.appendChild(transactionRow);
    });
}

async function updateTransactionsMyAccount() {
    const username = await fetchUsername();
    const transactions = await fetchTransactions(username);
    const transactionTableBody = document.getElementById("transaction-data-my-account");

    // Clear existing rows
    transactionTableBody.innerHTML = "";

    // Sort transactions by date in descending order
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Populate table rows
    transactions.forEach(transaction => {
        const transactionRow = document.createElement("tr");
        const isSender = transaction.sender_account === username;
        const amount = isSender ? `- €${transaction.amount.toFixed(2)}` : `+ €${transaction.amount.toFixed(2)}`;
        const amountClass = isSender ? 'amount-red' : 'amount-green';
        transactionRow.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${isSender ? transaction.beneficiary_account : transaction.sender_account}</td>
            <td>${transaction.transactionName}</td>
            <td class="${amountClass}">${amount}</td>
            <td>${transaction.category}</td>
        `;
        transactionTableBody.appendChild(transactionRow);
    });
}

document.addEventListener("DOMContentLoaded", updateTransactionsMyAccount);

document.addEventListener("DOMContentLoaded", initialiseDashboard);

async function logout() {
    try {
        const response = await fetch('/transactions/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            window.location.href = '/login.html';
        } else {
            alert('Error logging out');
        }
    } catch (error) {
        console.error('Error logging out:', error);
        alert('Error logging out');
    }
}

// Initialise all dynamic data on page load
function initialiseDashboard() {
    updateBalance();
    updateFirstname();
    updateTransactionsDashboard();
}

// Call initialiseDashboard to load data on page load
document.addEventListener("DOMContentLoaded", initialiseDashboard);