// Creating menu items 
const navMenuItems = [
    { name: "Home", href: "/Pages/HomePage/index.html" },
    { name: "About", href: "/Pages/ServicesPage/index.html" },
    { name: "Services", href: "/Pages/ContactUsPage/index.html" },
    { name: "Design", href: "/Pages/DesignPage/index.html" }
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

    //lastly the list should get added to the nav element
    nav.appendChild(ul);
}

 
document.addEventListener('DOMContentLoaded', () => {
    CreateMenuItems(); 

    const hamburgerButton = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    console.log('Hamburger Button:', hamburgerButton);
    console.log('Nav Links:', navLinks);

    hamburgerButton.addEventListener('click', () => {
        navLinks.classList.toggle('show'); 
    });
});

