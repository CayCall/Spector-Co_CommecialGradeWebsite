const sideMenuItems = [
    { name: "Style Guide", href: "/Spector-Co_CommecialGradeWebsite/Pages/DesignPage/LoadPage/styleguide.html", icon: "fas fa-paint-brush" },
    { name: "Wireframes", href: "/Spector-Co_CommecialGradeWebsite/Pages/DesignPage/LoadPage/wireframes.html", icon: "fas fa-drafting-compass" },
    { name: "UI and UX Decisions", href: "/Spector-Co_CommecialGradeWebsite/Pages/DesignPage/LoadPage/uidecisions.html", icon: "fas fa-lightbulb" },
    { name: "My Essay", href: "/Spector-Co_CommecialGradeWebsite/Pages/DesignPage/LoadPage/essay.html", icon: "fas fa-book" }
];

const menuList = document.getElementById('menu-list');
const contentDiv = document.querySelector('.content');

// Function to render the menu
function renderMenu() {
    sideMenuItems.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#" class="menu-item" data-href="${item.href}">
                <i class="${item.icon}"></i> ${item.name}
            </a>`;
        menuList.appendChild(li);
    });
}

// Function to handle menu item clicks
function handleMenuClick(event) {
    const menuItem = event.target.closest('.menu-item');
    if (!menuItem) return; // Exit if not a menu item

    // Prevent the default action of the anchor tag
    event.preventDefault();

    // Remove active class from all items
    const items = document.querySelectorAll('.sidebar li');
    items.forEach(item => item.classList.remove('active'));

    // Add active class to the clicked item
    menuItem.parentElement.classList.add('active');

    // Fetch and display the content
    const href = menuItem.getAttribute('data-href');
    fetchContent(href);
}

// Function to fetch and display the HTML content
function fetchContent(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            // Update the content div with the fetched HTML
            contentDiv.innerHTML = html;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            contentDiv.innerHTML = '<p>Error loading content. Please try again later.</p>';
        });
}

// Render the menu
renderMenu();

// Function to initialise wireframe navigation
function initializeWireframeNavigation(wireframeId, wireframeImages) {
    let currentIndex = 0;
    const nextButton = document.getElementById('next-' + wireframeId);
    const prevButton = document.getElementById('prev-' + wireframeId);
    const imageElement = document.getElementById('current-wireframe-' + wireframeId);

    // Show the first wireframe image initially
    imageElement.src = wireframeImages[currentIndex];

    // Next button listener
    nextButton.addEventListener('click', function () {
        currentIndex = (currentIndex + 1) % wireframeImages.length;
        imageElement.src = wireframeImages[currentIndex];
    });

    // Previous button listener
    prevButton.addEventListener('click', function () {
        currentIndex = (currentIndex - 1 + wireframeImages.length) % wireframeImages.length;
        imageElement.src = wireframeImages[currentIndex];
    });
}

// Wireframe images for each page
const wireframeData = {
    wireframe1: [
        '../../../Images/Wireframes/annotated - Home Page.png',
    ],
    wireframe2: [
        '../../../Images/Wireframes/annotated - about page.png',
    ],
    wireframe3: [
        '../../../Images/Wireframes/annotated - services page.png',
    ],
    wireframe4: [
        '../../../Images/Wireframes/DesignPage- annotated.png',
    ],
    wireframe5: [
        '../../../Images/Wireframes/contactusPage.png',
    ]
};

// Initialize the wireframe navigation for all pages
for (const wireframeId in wireframeData) {
    if (wireframeData.hasOwnProperty(wireframeId)) {
        initializeWireframeNavigation(wireframeId, wireframeData[wireframeId]);
    }
}