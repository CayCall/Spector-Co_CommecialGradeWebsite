
document.querySelectorAll('.read-more').forEach(button => {
    button.addEventListener('click', function() {
        const content = this.nextElementSibling;
        content.classList.toggle('visible');

        // Change button text based on content visibility
        this.textContent = content.classList.contains('visible') ? 'Read Less' : 'Read More';
    });
});

