// need to get access to each page, get the index.html of each page
//creating my menu items 
const navMenuItems = [
    {name: "Home Page", href: "/index.html"},
    {name: "Services Page", href: "/index.html"},
    {name: "Contact Page", href: "/index.html"},
    {name: "Design Page", href: "/index.html"}
]

// method for creating Menu Items 
function CreateMenuItems(){
    const nav = document.querySelector('Nav-Bar');
    const ul = document.createElement('ul');

    // ensuring ther iteration of the Menu items array to create each individual element for the NAV
    navMenuItems.forEach(element => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = item.name;
        a.href = item.href;
        li.appendChild(a)
        ul.appendChild(li);
    });
    nav.appendChild(ul); 
}

//after html loads I will execute the DOM event 
document.addEventListener('DOMContentLoaded', CreateMenuItems);







   




