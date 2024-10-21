// Add an event listener to the form with the ID 'loginForm', which listem for the form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    
    // Prevent the default form submission behavior
    event.preventDefault();

    // Retrieve the values of the username and password input fields
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;


    // Simple Template Only!!

    // Simple validation check to ensure both fields are filled
    if (username && password) {
        // If both fields are filled, show a success message
        alert('Login successful!');
    } else {
        
        // If either field is empty, prompt the user to fill in both fields
        alert('Please fill in both fields.');
    }
});