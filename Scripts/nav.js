// Creating menu items 
const navMenuItems = [
    { name: "Home", href: "/Pages/HomePage/index.html" },
    { name: "About", href: "/Pages/ServicesPage/index.html" },
    { name: "Services", href: "/Pages/ContactUsPage/index.html" },
    { name: "Design", href: "/Pages/DesignPage/index.html" }
];

// Method for creating Menu Items 
function CreateMenuItems() {
    const nav = document.querySelector('nav');
    const ul = document.createElement('ul');
    ul.id = 'nav-links'; // Give an ID for easier access

    // Iterating through the menu items array to create each individual element for the NAV
    navMenuItems.forEach(element => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = element.name;
        a.href = element.href; // Link to the page
        a.addEventListener('click', (event) => {
            // Navigate to the selected page
            window.location.href = element.href; 
        });
        li.appendChild(a);
        ul.appendChild(li);
    });
    nav.appendChild(ul);
}

// Execute the DOM event after HTML loads 
document.addEventListener('DOMContentLoaded', () => {
    CreateMenuItems(); // Ensure the menu is created after DOM is loaded

    // Hamburger menu toggle functionality
    const hamburgerButton = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    // Check if the elements are found
    console.log('Hamburger Button:', hamburgerButton);
    console.log('Nav Links:', navLinks);

    hamburgerButton.addEventListener('click', () => {
        navLinks.classList.toggle('show'); // Toggle 'show' class to display links
    });
});


// Scroll Event for Header
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll < lastScrollTop) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
});
