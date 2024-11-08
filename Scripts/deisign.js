document.addEventListener('DOMContentLoaded', function() {
    // all my menu Items
    const sideMenuItems = [
        { name: "Style Guide", href: "/Spector-Co_CommecialGradeWebsite/Pages/DesignPage/LoadPage/styleguide.html", icon: "fas fa-paint-brush" },
        { name: "Wireframes", href: "/Spector-Co_CommecialGradeWebsite/Pages/DesignPage/LoadPage/wireframes.html", icon: "fas fa-drafting-compass" },
        { name: "UI and UX Decisions", href: "/Spector-Co_CommecialGradeWebsite/Pages/DesignPage/LoadPage/uidecisions.html", icon: "fas fa-lightbulb" },
        { name: "First Essay", href: "/Spector-Co_CommecialGradeWebsite/Pages/DesignPage/LoadPage/essay2.html", icon: "fas fa-pen" },
        { name: "Critical Analysis Essay", href: "/Spector-Co_CommecialGradeWebsite/Pages/DesignPage/LoadPage/essay.html", icon: "fas fa-book" }
    ];

    const menuList = document.getElementById('menu-list');
    const contentDiv = document.querySelector('.content');

    // will render the menu in the menu-list container
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

    // handles the clicks, depending on the menu item clicked, the arra
    function handleMenuClick(event) {
        const menuItem = event.target.closest('.menu-item');
        if (!menuItem) return; // Exit if not a menu item

        event.preventDefault();
        const items = document.querySelectorAll('.sidebar li');
        items.forEach(item => item.classList.remove('active'));// this will apply remove the active class from every menu item 

        menuItem.parentElement.classList.add('active');// which ever item I click the active class gets appended to the item as a parent
        const href = menuItem.getAttribute('data-href'); // displays content
        fetchContent(href);
    }

    // fetch and display the HTML content 
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
    renderMenu();
    menuList.addEventListener('click', handleMenuClick);
});

