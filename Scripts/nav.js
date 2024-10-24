const navMenuItems = [
    { name: "Home", href: "/Spector-Co_CommecialGradeWebsite/index.html" },
    { name: "Services", href: "/Spector-Co_CommecialGradeWebsite/Pages/ServicesPage/services.html" },
    { name: "About", href: "/Spector-Co_CommecialGradeWebsite/Pages/AboutPage/about.html" },
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
        a.addEventListener('click', (event) => {
            window.location.href = element.href;
        });
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



// Home Page navigation
// Added event listener to document so that after my homepage index.html script loads, I can manipulate any elements
document.addEventListener('DOMContentLoaded', () => {
    createMenuItems(); // Call the function with the correct case

    const hamburgerButton = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    // Event listener for hamburger menu is used - specifically for the smaller devices (max 768px)
    hamburgerButton.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
});

//used to load my about page
const loadAboutPage = () => {
    window.location.href = "/Spector-Co_CommecialGradeWebsite/Pages/AboutPage/about.html";
};
//used for my services page
const loadServicesPage = () => {
    window.location.href = "/Spector-Co_CommecialGradeWebsite/Pages/ServicesPage/services.html";
};


let currentIndex = 0;
//testomonials navigation
showSlide(currentIndex);
function showSlide(index) {
    let slides = document.getElementsByClassName("testimonial-item");
    let dots = document.getElementsByClassName("dot");

    // Hide all slides initially
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    // Remove "active" class from all dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    // Show the current slide and activate the corresponding dot
    slides[index].style.display = "block";
    dots[index].className += " active";
}

function currentSlide(index) {
    currentIndex = index - 1;
    showSlide(currentIndex);
}

// check if elements rect is in viewport 
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= window.innerHeight &&
        rect.bottom >= 0
    );

}
// used to call my animation for the p in  my content container item, just to add some dyamic animation 
function handleScroll() {
    const elements = document.querySelectorAll('.content-container-item p');
    elements.forEach((element) => {
        if (isInViewport(element)) {
            element.classList.add('animate');
        }
    });

}

// listen for scroll
window.addEventListener('scroll', handleScroll);

//lastly I call the animation
handleScroll();

//Function for my back to top button that will be controlled through, how far down i scroll on my document
const backToTopButton = document.getElementById('backToTopBtn');
window.onscroll = () => {
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    // Check if the user has scrolled down exactly three-quarters of my html document's height
    if (scrollPosition > (documentHeight - viewportHeight) * 0.75) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
};

// about PAGE
const toggleFocusDetails = (element) => {
    const details = element.nextElementSibling;
    details.style.display = details.style.display === "block" ? "none" : "block";
};

// page navigation
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('scroll-button').addEventListener('click', () => {
        document.querySelector('section').scrollIntoView({
            behavior: 'smooth'
        });
    });
});