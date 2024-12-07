async function setMonthlyBudget() {
    const budget = prompt("Enter your monthly budget:");
    if (budget) {
        try {
            const response = await fetch('/utilisateurs/setBudget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ budget }),
            });

            if (response.ok) {
                alert('Monthly budget set successfully');
            } else {
                alert('Error setting monthly budget');
            }
        } catch (error) {
            console.error('Error setting monthly budget:', error);
            alert('Error setting monthly budget');
        }
    }
}

async function resetPassword() {
    const newPassword = prompt("Enter your new password:");
    if (newPassword) {
        try {
            const response = await fetch('/utilisateurs/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword }),
            });

            if (response.ok) {
                alert('Password reset successfully');
            } else {
                alert('Error resetting password');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            alert('Error resetting password');
        }
    }
}

async function deleteAccount() {
    const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmation) {
        try {
            const response = await fetch('/utilisateurs/deleteAccount', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert('Account deleted successfully');
                window.location.href = '/login.html';
            } else {
                alert('Error deleting account');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Error deleting account');
        }
    }
}
