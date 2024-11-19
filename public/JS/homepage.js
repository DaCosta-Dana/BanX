
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
    updateUsername();
}

// Call initialiseDashboard to load data on page load
document.addEventListener("DOMContentLoaded", initialiseDashboard);