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

// Submit new transaction
document.getElementById("transaction-step-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const beneficiary = document.getElementById("beneficiary").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const comment = document.getElementById("comment").value;

    // Add new transaction
    transactions.unshift({
        date: new Date().toISOString().split('T')[0],
        description: `Transfer to ${beneficiary} ${comment ? `- ${comment}` : ""}`,
        amount: -amount,
        status: "Completed"
    });

    // Hide modal and refresh transactions
    hideTransactionModal();
    renderTransactions();
});

//CALENDAR 

// Simulate recurring payments
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

    // Calendar header
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement("div");
        dayHeader.classList.add("header");
        dayHeader.textContent = day;
        calendar.appendChild(dayHeader);
    });

    // Get current month and year
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Fill in blank days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const blankDay = document.createElement("div");
        calendar.appendChild(blankDay);
    }

    // Fill in days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("day");
        dayCell.textContent = day;

        // Highlight the current day
        if (day === today.getDate()) {
            dayCell.classList.add("current-day");
        }

        // Highlight recurring payments
        if (recurringPayments.some(payment => payment.day === day)) {
            dayCell.classList.add("recurring-payment");
        }

        calendar.appendChild(dayCell);
    }
}

// Render upcoming payments
function renderUpcomingPayments() {
    const upcomingPaymentsList = document.getElementById("upcoming-payments-list");
    upcomingPaymentsList.innerHTML = ""; // Clear previous content

    recurringPayments.forEach(payment => {
        const paymentItem = document.createElement("div");
        paymentItem.classList.add("upcoming-payment-item");
        paymentItem.textContent = `${payment.name}: $${payment.amount.toFixed(2)} (Due on ${payment.day})`;
        upcomingPaymentsList.appendChild(paymentItem);
    });
}

// Initialize the page
renderCalendar();
renderUpcomingPayments();