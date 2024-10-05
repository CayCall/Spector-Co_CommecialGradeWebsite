
// universal nav for all pages
// Creating menu items 
const navMenuItems = [
    { name: "Home", href: "/Spector-Co_CommecialGradeWebsite/index.html" },
    { name: "Services", href: "/Spector-Co_CommecialGradeWebsite/Pages/ServicesPage/index.html" },
    { name: "About", href: "/Spector-Co_CommecialGradeWebsite/Pages/AboutPage/index.html" },
    { name: "Design", href: "/Spector-Co_CommecialGradeWebsite/Pages/DesignPage/index.html" }
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

//used to load my about page
function loadAboutPage() {
    window.location.href = "/Spector-Co_CommecialGradeWebsite/Pages/AboutPage/index.html ";
}
//used for my services page
function loadServicesPage() {
    window.location.href = "/Spector-Co_CommecialGradeWebsite/Pages/ServicesPage/index.html ";
}

let currentIndex = 0;
showSlide(currentIndex);
//testomonials navigation
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


//Function for my back to top button that will be controlled through, how far down i scroll on my document
window.onscroll = function () {
    const button = document.getElementById('backToTopBtn');
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Check if the user has scrolled down exactly three-quarters of my html document's height
    if (scrollPosition > (documentHeight - viewportHeight) * 0.75) {
        button.classList.add('show');
    } else {
        button.classList.remove('show'); 
    }
};

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// about PAGE
function toggleFocusDetails(element) {
    var details = element.nextElementSibling;
    if (details.style.display === "block") {
        details.style.display = "none";
    } else {
        details.style.display = "block";
    }
}


