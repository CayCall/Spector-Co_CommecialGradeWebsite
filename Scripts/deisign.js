document.addEventListener('DOMContentLoaded', function() {
    // Your existing code goes here, such as:
    const sideMenuItems = [
        { name: "Style Guide", href: "/Spector-Co_CommecialGradeWebsite/Pages/DesignPage/LoadPage/styleguide.html", icon: "fas fa-paint-brush" },
        { name: "Wireframes", href: "/Spector-Co_CommecialGradeWebsite/Pages/DesignPage/LoadPage/wireframes.html", icon: "fas fa-drafting-compass" },
        { name: "UI and UX Decisions", href: "/Spector-Co_CommecialGradeWebsite/Pages/DesignPage/LoadPage/uidecisions.html", icon: "fas fa-lightbulb" },
        { name: "Critical Analysis Essay", href: "/Spector-Co_CommecialGradeWebsite/Pages/DesignPage/LoadPage/essay.html", icon: "fas fa-book" }
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
});

document.addEventListener("DOMContentLoaded", () => {
    // Define an array of wireframes with their respective titles and image sources
    const wireframes = [
        {
            title: "Wireframe 1: Homepage Layout",
            imgSrc: "../../Images/Wireframes/annotated - Home Page.png"
        },
        {
            title: "Wireframe 2: About Page",
            imgSrc: "../../Images/Wireframes/annotated - about page.png"
        },
        {
            title: "Wireframe 3: Services Page",
            imgSrc: "../../Images/Wireframes/annotated - services page.png"
        },
        {
            title: "Wireframe 4: Design Page",
            imgSrc: "../../Images/Wireframes/DesignPage- annotated.png"
        },
        {
            title: "Wireframe 5: Contact Us Page",
            imgSrc: "../../Images/Wireframes/contactusPage.png"
        }
    ];

    let currentWireframeIndex = 0; // Start at the first wireframe

    // Get references to the elements
    const wireframeTitle = document.getElementById('#wireframe-title');
    const wireframeImage = document.getElementById('#current-wireframe');
    const prevButton = document.getElementById('#prev');
    const nextButton = document.getElementById('#next');

    // Function to update the wireframe content based on the current index
    function updateWireframe() {
        const currentWireframe = wireframes[currentWireframeIndex];
        wireframeTitle.textContent = currentWireframe.title;
        wireframeImage.src = currentWireframe.imgSrc;

        // Update visibility of the Previous and Next buttons based on the current index
        prevButton.style.display = currentWireframeIndex === 0 ? "none" : "block";
        nextButton.style.display = currentWireframeIndex === wireframes.length - 1 ? "none" : "block";
    }

    // Event listener for the "Previous" button
    prevButton.addEventListener('click', () => {
        if (currentWireframeIndex > 0) {
            currentWireframeIndex--; // Move to the previous wireframe
            updateWireframe();
        }
    });

    // Event listener for the "Next" button
    nextButton.addEventListener('click', () => {
        if (currentWireframeIndex < wireframes.length - 1) {
            currentWireframeIndex++; // Move to the next wireframe
            updateWireframe();
        }
    });

    // Initial call to update the wireframe content on page load
    updateWireframe();
});
