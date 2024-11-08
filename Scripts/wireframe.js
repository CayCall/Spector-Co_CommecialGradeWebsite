document.addEventListener("DOMContentLoaded", () => {

    const wireframes = [
        "wireframe-1",
        "wireframe-2",
        "wireframe-3",
        "wireframe-4",
        "wireframe-5"
    ];

    let currentWireframeIndex = 0; // Start at the first wireframe

    // Get references to the elements
    const wireframeTitle = document.getElementById('wireframe-title');
    const wireframeImages = document.querySelectorAll('.wireframe');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    // Function to update the wireframe content based on the current index
    function updateWireframe() {
        // Hide all wireframes
        wireframeImages.forEach(img => img.style.display = "none");

        // Show the current wireframe
        document.getElementById(wireframes[currentWireframeIndex]).style.display = "block";

        // Update title
        wireframeTitle.textContent = `Wireframe ${currentWireframeIndex + 1}: ${wireframeTitleList[currentWireframeIndex]}`;

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
