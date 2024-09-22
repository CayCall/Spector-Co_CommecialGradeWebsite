// need to get access to each page, get the index.html of each page
//creating my menu items 
const navMenuItems = [
    {name: "Home", href: "/Pages/HomePage/index.html"},
    {name: "About", href: "/Pages/ServicesPage/index.html"},
    {name: "Services", href: "/Pages/ContactUsPage/index.html"},
    {name: "Design", href: "/Pages/DesignPage/index.html"}
]

// method for creating Menu Items 
function CreateMenuItems(){
    const nav = document.querySelector('nav');
    const ul = document.createElement('ul');

    // ensuring ther iteration of the Menu items array to create each individual element for the NAV
    navMenuItems.forEach(element => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = element.name;
        a.href = element.href;
        li.appendChild(a)
        ul.appendChild(li);
    });
    nav.appendChild(ul); 
}

//after html loads I will execute the DOM event 
document.addEventListener('DOMContentLoaded', CreateMenuItems);


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






   




