// Array of wireframe objects
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

// Select necessary DOM elements
const wireframeContainer = document.getElementById("wireframe-container");
const wireframeTitle = document.getElementById("wireframe-title");
const wireframeImages = document.querySelectorAll(".wireframe-image");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

// Initialize current index to 0
let currentIndex = 0;

// Function to hide all images
function hideAllImages() {
    wireframeImages.forEach(image => {
        image.style.display = 'none';
    });
}

// Function to show the current image and update the title
function showCurrentWireframe(index) {
    hideAllImages();
    wireframeImages[index].style.display = 'block';
    wireframeTitle.textContent = wireframes[index].title; // Update title
}

// Add event listener for previous button
prevButton.addEventListener("click", function() {
    currentIndex = (currentIndex - 1 + wireframes.length) % wireframes.length; // Loop to last image if at the beginning
    showCurrentWireframe(currentIndex);
});

// Add event listener for next button
nextButton.addEventListener("click", function() {
    currentIndex = (currentIndex + 1) % wireframes.length; // Loop to first image if at the end
    showCurrentWireframe(currentIndex);
});

// Show the first wireframe initially
showCurrentWireframe(currentIndex);
