
//declaring my vraraibles first
const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const messageInput = document.getElementById('message');
const subscribeInput = document.getElementById('subscribe');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const phoneError = document.getElementById('phone-error');
const passwordError = document.getElementById('password-error');
const messageError = document.getElementById('message-error');
const subscribeError = document.getElementById('subscribe-error');
const successMessage = document.getElementById('success-message');



//system revolves aroud local bool declarations in 1 fucntion that will streamline the entire form
//listen for this event interacting with submit
form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate the users name
    if (nameInput.value.trim() === '') {
        nameError.textContent = 'Name is required.';
        isValid = false;
    } else if (!/^[a-zA-Z ]+$/.test(nameInput.value.trim())) {
        nameError.textContent = 'Name can only contain letters and spaces.';
        isValid = false;
    } else {
        nameError.textContent = '';
    }

    // Validate the userrs email
    if (emailInput.value.trim() === '') {
        emailError.textContent = 'Email is required.';
        isValid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput.value.trim())) {
        emailError.textContent = 'Invalid email format.';
        isValid = false;
    } else {
        emailError.textContent = '';
    }

    // Validate the users number
    if (phoneInput.value.trim() === '') {
        phoneError.textContent = 'Phone number is required.';
        isValid = false;
    } else if (!/^\d{10}$/.test(phoneInput.value.trim())) {
        phoneError.textContent = 'Phone number must be 10 digits.';
        isValid = false;
    } else {
        phoneError.textContent = '';
    }

    // Validate the users email
    if (passwordInput.value.trim() === '') {
        passwordError.textContent = 'Password is required.';
        isValid = false;
    } else if (passwordInput.value.trim().length < 8) {
        passwordError.textContent = 'Password must be at least 8 characters.';
        isValid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(passwordInput.value.trim())) {
        passwordError.textContent = 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.';
        isValid = false;
    } else {
        passwordError.textContent = '';
    }

    // Validatation message
    if (messageInput.value.trim() === '') {
        messageError.textContent = 'Message is required.';
        isValid = false;
    } else if (messageInput.value.trim().length > 500) {
        messageError.textContent = 'Message cannot exceed 500 characters.';
        isValid = false;
    } else {
        messageError.textContent = '';
    }

    // Validate Subscribe
    if (!subscribeInput.checked) {
        subscribeError.textContent = 'You must agree to the terms and conditions.';
        isValid = false;
    } else {
        subscribeError.textContent = '';
    }

    let waitTime = 5; 
    const successMessage = document.getElementById('success-message'); 
    
    // Function to update the success message element when the user types everything in correctly
    function updateSuccessMessage() {
        if (waitTime > 0) {
            successMessage.textContent = 'Form submitted successfully!';
        } else {
            successMessage.textContent = ''; // Clear the message if the waitTime is =0
        }
    }
    
    // Decrease waitTime every 1 second so the message is only there for 5 seconds
    const intervalId = setInterval(() => {
        if (waitTime > 0) {
            waitTime -= 1;
            updateSuccessMessage(); 
        } else {
            clearInterval(intervalId); // Stop the interval when waitTime reaches 0
        }
    }, 1000); // 1000 milliseconds = 1 second
    
    // Call this function when the form is valid and each field is filled in correctly
    if (isValid) {
        updateSuccessMessage(); 
    }
});