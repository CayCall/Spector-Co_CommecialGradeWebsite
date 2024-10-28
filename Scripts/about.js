document.addEventListener('DOMContentLoaded', () => {
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    const handleScroll = () => {
        const containers = document.querySelectorAll('.container'); 
        containers.forEach(container => {
            if (isInViewport(container)) {
                container.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
});


document.addEventListener('DOMContentLoaded', () => {
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    const handleLearnscroll = () => {
        const containers = document.querySelectorAll('.container'); 
        containers.forEach(container => {
            if (isInViewport(container)) {
                container.classList.add('visible');
            }
        });
    };

    // Smooth scroll to the firm-info section
    const scrollArrow = document.querySelector('.scroll-arrow');
    const firmInfoSection = document.querySelector('.firm-info');

    scrollArrow.addEventListener('click', () => {
        firmInfoSection.scrollIntoView({ behavior: 'smooth' });
    });

    window.addEventListener('scrollLearn', handleLearnscroll);
    handleLearnscroll();
});

