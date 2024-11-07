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
    const wireframeTitle = document.getElementById('wireframe-title');
    console.log("Found", wireframeImage, wireframeTitle, prevButton, nextButton);
    const wireframeImage = document.getElementById('current-wireframe');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

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
