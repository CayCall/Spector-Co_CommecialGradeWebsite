
// Testimonial navigation
let currentIndex = 0; // Start from the first testimonial
showSlide(currentIndex); // Show the first slide

function showSlide(index) {
    let slides = document.getElementsByClassName("testimonial-item");

    // Wrap around if index is out of bounds
    if (index >= slides.length) {
        currentIndex = 0; // Go back to the first slide
    } else if (index < 0) {
        currentIndex = slides.length - 1; // Go to the last slide
    } else {
        currentIndex = index; // Set the current index
    }

    // Hide all slides initially
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"; // Hide each slide
    }

    // Show the current slide
    slides[currentIndex].style.display = "block"; // Display the current slide
}

// Function to change slides when arrows are clicked
function changeSlide(direction) {
    showSlide(currentIndex + direction); // Change the slide based on direction
}

// Initial call to show the first slide
showSlide(currentIndex);


//Ho to handle scroll animation
function handleScroll() {
  const elements = document.querySelectorAll('.content-container-item p');
  elements.forEach((element) => {
      if (isInViewport(element)) {
          element.classList.add('animate');
      }
  });
}

