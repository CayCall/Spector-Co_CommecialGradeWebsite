const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Function to handle scroll event
const handleScroll = () => {
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => {
        if (isInViewport(container)) {
            container.classList.add('visible'); 
        }
    });
};

// Add scroll event listener
window.addEventListener('scroll', handleScroll);

// Initial check
handleScroll();