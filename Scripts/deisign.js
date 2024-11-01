
document.querySelectorAll('.read-more').forEach(button => {
    button.addEventListener('click', function () {
        const content = this.nextElementSibling;
        content.classList.toggle('visible');

        // Change button text based on content visibility
        this.textContent = content.classList.contains('visible') ? 'Read Less' : 'Read More';
    });
});
const sideMenuItems = [
    { name: "Style Guide", href: "/Spector-Co_CommecialGradeWebsite/DesignPage/LoadPage/styleguide.html", icon: "fas fa-paint-brush" },
    { name: "Wireframes", href: "/Spector-Co_CommecialGradeWebsite/DesignPage/LoadPage/wireframes.html", icon: "fas fa-drafting-compass" },
    { name: "UI and UX Decisions", href: "/Spector-Co_CommecialGradeWebsite/DesignPage/LoadPage/uidecisions.html", icon: "fas fa-lightbulb" },
    { name: "My Essay", href: "/Spector-Co_CommecialGradeWebsite/DesignPage/LoadPage/essay.html", icon: "fas fa-book" }
];

const menuList = document.getElementById('menu-list');

// Function to render the menu
function renderMenu() {
    sideMenuItems.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
                <a href="${item.href}" class="menu-item">
                    <i class="${item.icon}"></i> ${item.name}
                </a>`;
        menuList.appendChild(li);
    });
}

// Function to handle menu item clicks
function handleMenuClick(event) {
    const items = document.querySelectorAll('.sidebar li');
    items.forEach(item => item.classList.remove('active')); // Remove active class from all
    event.currentTarget.parentElement.classList.add('active'); // Add active class to the clicked item
}

// Render the menu
renderMenu();

// Add click event listeners to menu items
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('click', handleMenuClick);
});

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
