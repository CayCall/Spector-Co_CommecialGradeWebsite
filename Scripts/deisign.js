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

// Add click event listener to the menu list
menuList.addEventListener('click', handleMenuClick);

// for the wire frames on wireframes.html
let currentIndex = 0;
const wireframes = [
    'path_to_wireframe_image1.png',
    'path_to_wireframe_image2.png',
    // Add more wireframe images here
];

document.getElementById('next').addEventListener('click', function () {
    currentIndex = (currentIndex + 1) % wireframes.length;
    document.getElementById('current-wireframe').src = wireframes[currentIndex];
});

document.getElementById('prev').addEventListener('click', function () {
    currentIndex = (currentIndex - 1 + wireframes.length) % wireframes.length;
    document.getElementById('current-wireframe').src = wireframes[currentIndex];
});
