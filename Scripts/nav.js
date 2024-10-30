const navMenuItems = [
    { name: "Home", href: "/Spector-Co_CommecialGradeWebsite/index.html" },
    { name: "About", href: "/Spector-Co_CommecialGradeWebsite/Pages/AboutPage/about.html" },
    { name: "Services", href: "/Spector-Co_CommecialGradeWebsite/Pages/ServicesPage/services.html" },
    { name: "Design", href: "/Spector-Co_CommecialGradeWebsite/Pages/DesignPage/design.html" },
    { name: "Contact us", href: "/Spector-Co_CommecialGradeWebsite/Pages/ContactPage/contact.html" }
];

// Method for creating Menu Items 
const createMenuItems = () => {
    const nav = document.querySelector('.nav-bar');
    const ul = document.createElement('ul');
    ul.id = 'nav-links';

    navMenuItems.forEach((element) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = element.name;
        a.href = element.href;

        // Add a class for styling the "Contact Us" link as a button
        if (element.name === "Contact us") {
            a.classList.add('button-link');
        }

        // Check if the current page matches the link's href
        if (window.location.pathname === element.href) {
            a.classList.add('active');
        }

        li.appendChild(a);
        ul.appendChild(li);
    });

    nav.appendChild(ul);
};

// Add scroll event listener
const header = document.querySelector('header'); // Select the header
const navBar = document.querySelector('.nav-bar'); // Select the nav-bar
const scrollThreshold = 200; // Adjust this value as needed

window.addEventListener('scroll', () => {
    if (window.scrollY >= scrollThreshold) {
        header.classList.add('shrink'); // Add shrink class to header
        navBar.classList.add('scroll-to'); // Add scroll-to class to nav-bar
    } else {
        header.classList.remove('shrink'); // Remove shrink class from header
        navBar.classList.remove('scroll-to'); // Remove scroll-to class from nav-bar
    }
});

// Scroll-to button on every page
document.addEventListener('DOMContentLoaded', () => {
    const scrollButton = document.getElementById('scroll-button');

    scrollButton.addEventListener('click', () => {
        const buttonRect = scrollButton.getBoundingClientRect();
        const buttonInView = buttonRect.top >= 0 && buttonRect.bottom <= window.innerHeight;

        if (buttonInView) {
            document.querySelector('.scroll-to').scrollIntoView({
                behavior: 'smooth'
            });
        } else {
            console.log("Button is not in view.");
            
        }
    });
});

// Home Page navigation
document.addEventListener('DOMContentLoaded', () => {
    createMenuItems(); // Call the function to create menu items

    const hamburgerButton = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    // Event listener for hamburger menu for smaller devices
    hamburgerButton.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
});


// Check if an element is in the viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= window.innerHeight &&
        rect.bottom >= 0
    );
}

// Function to handle scroll animation
function handleScroll() {
    const elements = document.querySelectorAll('.content-container-item p');
    elements.forEach((element) => {
        if (isInViewport(element)) {
            element.classList.add('animate');
        }
    });
}

// Listen for scroll
window.addEventListener('scroll', handleScroll);

// scroll to the top button
const backToTopButton = document.getElementById('backToTopBtn');
window.onscroll = () => {
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    // Check if the user has scrolled down exactly three-quarters of the html document's height
    if (scrollPosition > (documentHeight - viewportHeight) * 0.75) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};


// About PAGE nav for the accordions
const toggleFocusDetails = (element) => {
    const details = element.nextElementSibling;
    details.style.display = details.style.display === "block" ? "none" : "block";
};


//page loaders - for buttons in case i want to load a specific page
// Function to load the About page
const loadAboutPage = () => {
    window.location.href = "/Spector-Co_CommecialGradeWebsite/Pages/AboutPage/about.html";
};

// Function to load the Services page
const loadServicesPage = () => {
    window.location.href = "/Spector-Co_CommecialGradeWebsite/Pages/ServicesPage/services.html";
};


console.log('nav.js loaded');