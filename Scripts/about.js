document.addEventListener("DOMContentLoaded", function () {
    const containers = document.querySelectorAll('.container');

    function checkVisibility() {
        const windowHeight = window.innerHeight;

        containers.forEach(container => {
            const rect = container.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom > 0) {
                container.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkVisibility);
    checkVisibility();
});

document.addEventListener("DOMContentLoaded", function () {
    const containers = document.querySelectorAll('.container');

    function checkVisibility() {
        const windowHeight = window.innerHeight;

        containers.forEach(container => {
            const rect = container.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom > 0) {
                container.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkVisibility);
    checkVisibility();
});


// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Modal handling
    const closeModal = document.querySelector(".modal-close");
    const modal = document.querySelector(".modal");
    const fetchLegalOpinionsButton = document.getElementById("fetch-legal-opinions");


    // Simulate data fetching
    window.onload = function () {
        setTimeout(() => {
            // Hide loading message and show the fetch button
            if (fetchLegalOpinionsButton) {
                fetchLegalOpinionsButton.style.display = 'block';
            }
        }, 1000); // Simulated loading time
    };

    // Fetch the data from the API
    fetch('https://www.courtlistener.com/api/rest/v4/opinions.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const results = data.results;
            const width = 1150;
            const height = 800;
            const fixedRadius = 55;

            const svg = d3.select("#bubble-chart")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

            const simulation = d3.forceSimulation(results)
                .force("charge", d3.forceManyBody().strength(5))
                .force("center", d3.forceCenter(width / 2, height / 2))
                .force("collision", d3.forceCollide().radius(fixedRadius + 2))
                .on("tick", ticked);

            const bubble = svg.selectAll(".bubble")
                .data(results)
                .enter().append("g")
                .attr("class", "bubble")
                .on("click", function (event, d) {
                    modal.style.display = "block";
                    const detailsDiv = d3.select(".modal");
                    detailsDiv.html(`
                        <strong>Opinion Id:</strong> #${d.id}<br>
                        <strong>Date of creation:</strong> ${d.date_created || 'No date available'}<br>
                        <strong>Opinion Link:</strong> <a href="${d.cluster}" target="_blank" style="color: #008080; font-weight: bold;">View Details</a><br>
                    `);
                });

            bubble.append("circle")
                .attr("r", fixedRadius)
                .attr("fill", '#008080')
                .on("mouseover", function (event, d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("r", fixedRadius * 1.2)
                        .attr("stroke", "black")
                        .attr("stroke-width", 2);
                })
                .on("mouseout", function (event, d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("r", fixedRadius) // Reset to fixed radius
                        .attr("stroke", "none");
                });

            bubble.append("text")
                .attr("dy", 4)
                .attr("fill", '#E5E5E5')
                .text(d => `ID: ${d.cluster_id}`);

            function ticked() {
                bubble.attr("transform", d => `translate(${d.x},${d.y})`);
            }
            closeModal.onclick = () => {
                modal.style.display = "none";
            };
        })
        .catch(error => console.error('Error fetching data:', error));
});
