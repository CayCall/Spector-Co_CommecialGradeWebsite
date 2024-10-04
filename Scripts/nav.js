
// universal nav for all pages
// Creating menu items 
const navMenuItems = [
    { name: "Home", href: "../../index.html" },
    { name: "About", href: "./Pages/AboutPage/index.html" },
    { name: "Services", href: "./Pages/ServicesPage/index.html" },
    { name: "Design", href: "./Pages/DesignPage/index.html" }
];

// Method for creating Menu Items 
function CreateMenuItems() {
    //selecting my nav tag 
    const nav = document.querySelector('nav');
    const ul = document.createElement('ul');

    ul.id = 'nav-links';


    //will iterate through my array, and create a list of hyperlinks for my nav
    navMenuItems.forEach(element => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = element.name;
        a.href = element.href;
        a.addEventListener('click', (event) => {
            window.location.href = element.href;
        });

        //add hyperlinks to my list 
        li.appendChild(a);
        ul.appendChild(li);
    });

    //lastly the list should get the list added to the nav element
    nav.appendChild(ul);
}


//Home Page naviagation
//added event listener to document so that after my homepage index.html script loads, i can manipulate any elements
document.addEventListener('DOMContentLoaded', () => {
    CreateMenuItems();

    const hamburgerButton = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');
    //event listener for hamburger menu is used - specifically for the smaller devices( max 768px)
    hamburgerButton.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
});


// universal scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


// Show/hide the button based on scroll position
window.onscroll = function () {
    const button = document.getElementById('backToTopBtn');
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Check if the user has scrolled down three-quarters of the document height
    if (scrollPosition > (documentHeight - viewportHeight) * 0.75) {
        button.classList.add('show'); // Add the 'show' class to trigger opacity transition
    } else {
        button.classList.remove('show'); // Remove the 'show' class
    }
};




function toggleFocusDetails(element) {
    var details = element.nextElementSibling;
    if (details.style.display === "block") {
        details.style.display = "none";
    } else {
        details.style.display = "block";
    }
}

// SERVICES PAGE
document.getElementById('scrollButton').addEventListener('click', () => {
    document.querySelector('main').scrollIntoView({
        behavior: 'smooth'
    });
});