
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
            <a href="${item.href}" class="menu-item">
                <i class="${item.icon}"></i> ${item.name}
            </a>`;
        menuList.appendChild(li);
    });
}

// Function to handle menu item clicks
function handleMenuClick(event) {
    event.preventDefault(); // Prevent the default anchor behavior

    const items = document.querySelectorAll('.sidebar li');
    items.forEach(item => item.classList.remove('active')); // Remove active class from all
    event.currentTarget.parentElement.classList.add('active'); // Add active class to the clicked item

    // Fetch the content from the href
    const url = event.currentTarget.getAttribute('href');
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            contentDiv.innerHTML = html; // Load the HTML into the content div
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Render the menu
renderMenu();

// Add click event listeners to menu items after rendering the menu
menuList.addEventListener('click', (event) => {
    if (event.target.closest('.menu-item')) {
        handleMenuClick(event);
    }
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
