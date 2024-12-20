let transactions = [
    { date: "2024-11-01", description: "Online Purchase",comment:"Amazon", amount: -120.00, status: "Completed" },
    { date: "2024-11-05", description: "Salary Credit",comment:"EY Salary", amount: 5500.00, status: "Completed" }
];

const transactionData = document.getElementById("transaction-data");
const noTransactionsMessage = document.getElementById("no-transactions-message");

// Render transactions
function renderTransactions() {
    transactionData.innerHTML = "";
    if (transactions.length === 0) {
        noTransactionsMessage.style.display = "block";
    } else {
        noTransactionsMessage.style.display = "none";
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

// Modal control
function showTransactionModal() {
    document.getElementById("transaction-modal").style.display = "block";
}

function hideTransactionModal() {
    document.getElementById("transaction-modal").style.display = "none";
}

// Form steps control
function nextStep(step) {
    document.getElementById(`step-${step - 1}`).style.display = "none";
    document.getElementById(`step-${step}`).style.display = "block";
}

function previousStep(step) {
    document.getElementById(`step-${step + 1}`).style.display = "none";
    document.getElementById(`step-${step}`).style.display = "block";
}

document.getElementById("transaction-modal").addEventListener("submit", async function(event) {
    event.preventDefault();

    const transactionName = document.getElementById("comment").value;
    const beneficiary_username = document.getElementById("beneficiary").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value || 'Uncategorized';
    const date = new Date().toISOString(); // Use current date for simplicity

    try {
        const response = await fetch('/transactions/addTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ transactionName, date, beneficiary_username, amount, category })
        });

        if (response.ok) {
            alert('Transaction added successfully');
            hideTransactionModal();
            // Optionally, refresh the transaction list or update the UI
        } else {
            alert('Failed to add transaction');
        }
    } catch (error) {
        console.error('Error adding transaction:', error);
        alert('An error occurred while adding the transaction');
    }
});

function showBeneficiaryModal() {
    document.getElementById("beneficiary-modal").style.display = "block";
}

function hideBeneficiaryModal() {
    document.getElementById("beneficiary-modal").style.display = "none";
}

document.getElementById("beneficiary-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("beneficiary-name").value;
    const iban = document.getElementById("beneficiary-iban").value;

    try {
        const response = await fetch('/utilisateurs/addBeneficiary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, iban })
        });

        if (response.ok) {
            alert('Beneficiary added successfully');
            hideBeneficiaryModal();
        } else {
            alert('Failed to add beneficiary');
        }
    } catch (error) {
        console.error('Error adding beneficiary:', error);
        alert('An error occurred while adding the beneficiary');
    }
});

async function fetchBeneficiaries() {
    try {
        const response = await fetch('/utilisateurs/beneficiaries');
        if (!response.ok) {
            throw new Error('Failed to fetch beneficiaries');
        }
        const data = await response.json();
        return data.beneficiaries;
    } catch (error) {
        console.error('Error fetching beneficiaries:', error);
        return [];
    }
}

async function populateBeneficiaryDropdown() {
    const beneficiaries = await fetchBeneficiaries();
    const beneficiaryDropdown = document.getElementById('beneficiary');
    beneficiaryDropdown.innerHTML = '<option value="">-- Select Beneficiary --</option>'; // Clear existing options

    beneficiaries.forEach(beneficiary => {
        const option = document.createElement('option');
        option.value = beneficiary.iban;
        option.textContent = beneficiary.name;
        beneficiaryDropdown.appendChild(option);
    });
}

// Call the function to populate the dropdown on page load
document.addEventListener('DOMContentLoaded', populateBeneficiaryDropdown);

async function fetchCategories() {
    try {
        const response = await fetch('/utilisateurs/categories');
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        return data.categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

async function populateCategoryDropdown() {
    const categories = await fetchCategories();
    const categoryDropdown = document.getElementById('category');
    categoryDropdown.innerHTML = '<option value="">-- Select Category --</option>'; // Clear existing options

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryDropdown.appendChild(option);
    });
}

// Call the function to populate the category dropdown on page load
document.addEventListener('DOMContentLoaded', populateCategoryDropdown);

//CALENDAR 

// let transaction = [
//     { date: "2024-11-01", description: "Online Purchase", comment: "Amazon", amount: -120.00, status: "Completed" },
//     { date: "2024-11-05", description: "Salary Credit", comment: "EY Salary", amount: 5500.00, status: "Completed" }
// ];

const recurringPayments = [
    { day: 5, name: "Spotify", amount: 9.99 },
    { day: 12, name: "Electricity Bill", amount: 50.0 },
    { day: 20, name: "Netflix", amount: 19.99 },
    { day: 25, name: "Gym Membership", amount: 35.0 }
];

const today = new Date();

// Render calendar
function renderCalendar() {
    const calendar = document.getElementById("payment-calendar");
    calendar.innerHTML = ""; // Clear previous content

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement("div");
        dayHeader.classList.add("header");
        dayHeader.textContent = day;
        calendar.appendChild(dayHeader);
    });

    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendar.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("day");
        dayCell.textContent = day;

        if (day === today.getDate()) {
            dayCell.classList.add("current-day");
        }

        if (recurringPayments.some(payment => payment.day === day)) {
            dayCell.classList.add("recurring-payment");
        }

        dayCell.addEventListener("click", () => showAddPaymentModal(day));
        calendar.appendChild(dayCell);
    }
}

function renderUpcomingPayments() {
    const upcomingPaymentsList = document.getElementById("upcoming-payments-list");
    upcomingPaymentsList.innerHTML = "";

    recurringPayments.forEach(payment => {
        const paymentItem = document.createElement("div");
        paymentItem.classList.add("upcoming-payment-item");
        paymentItem.textContent = `${payment.name}: $${payment.amount.toFixed(2)} (Due on ${payment.day})`;
        upcomingPaymentsList.appendChild(paymentItem);
    });
}


function showAddPaymentModal(day) {
    document.getElementById("payment-day").value = day;
    document.getElementById("add-payment-modal").style.display = "block";
}

function hideAddPaymentModal() {
    document.getElementById("add-payment-modal").style.display = "none";
    document.getElementById("add-recurring-payment-form").reset();
}

document.getElementById("add-recurring-payment-form").addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("payment-name").value;
    const amount = parseFloat(document.getElementById("payment-amount").value);
    const day = parseInt(document.getElementById("payment-day").value);

    recurringPayments.push({ day, name, amount });
    alert("Payment added!");
    renderCalendar();
    renderUpcomingPayments();
    hideAddPaymentModal();
});

renderCalendar();
renderUpcomingPayments();
