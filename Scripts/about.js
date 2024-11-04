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

window.onload = function () {
    // Simulate data fetching
    setTimeout(() => { // Hide loading message
        document.getElementById('fetch-legal-opinions').style.display = 'block'; // Show button
    }, 1000); // Simulated loading time
};

document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'https://www.courtlistener.com/api/rest/v3/opinions/?page=1';
    let legalData = [];

    async function fetchLegalOpinions() {
        if (legalData.length > 0) return legalData; // Return cached data if it already exists
    
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
    
            // Log the raw data for debugging
            console.log(data);
    
            // Adjust the mapping based on the actual structure of the API response
            legalData = data.results.map(opinion => ({
                id: opinion.id,
                Document: opinion.case_name || 'Unknown Document', // Check if case_name exists
                court: opinion.court || 'Unknown Court', // Check if court exists
                opinionsCount: opinion.opinions_count || 0, // Check if opinions_count exists
                pageCount: opinion.page_count || 0, // Check if page_count exists
                dateCreated: opinion.date_created || new Date().toISOString().split('T')[0], // Check if date_created exists
                type: opinion.type || '100trialcourt',
                cluster: opinion.cluster || '#', // Check if absolute_url exists
            }));
    
            return legalData;
        } catch (error) {
            console.error('Error fetching legal opinions:', error);
            return []; // Return an empty array in case of error
        }
    }
    async function populatePageDropdown() {
        const data = await fetchLegalOpinions();
        const dropdown = document.getElementById("page-filter");

        const uniqueDocuments = new Set(data.map(d => d.Document));

        uniqueDocuments.forEach(doc => {
            const option = document.createElement("option");
            option.value = doc;
            option.textContent = doc;
            dropdown.appendChild(option);
        });

        // Add event listener for dropdown changes
        dropdown.addEventListener('change', () => {
            highlightBubble(dropdown.value);
        });
    }

    function highlightBubble(selectedPage) {
        const bubbles = d3.selectAll(".bubble");
        bubbles.style("opacity", 0.7); // Reset all bubbles to default opacity

        if (selectedPage) {
            bubbles.each(function (d) {
                if (d.Document === selectedPage) {
                    d3.select(this).style("opacity", 1) 
                        .style("stroke", "orange")
                        .style("stroke-width", 2);
                }
            });
        } else {
            bubbles.style("stroke", "black")
                .style("stroke-width", 1);
        }
    }

    async function createBubbleChart() {
        const data = await fetchLegalOpinions();

        const width = 1000;
        const height = 600;
        const margin = { top: 20, right: 20, bottom: 50, left: 50 };

        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.opinionsCount) + 1])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.pageCount) + 1])
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale).ticks(10).tickSize(-height))
            .attr("class", "axis");

        svg.append("g")
            .call(d3.axisLeft(yScale).ticks(10).tickSize(-width))
            .attr("class", "axis");

        svg.append("text")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .style("text-anchor", "middle")
            .text("Opinions Count");

        svg.append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 15)
            .style("text-anchor", "middle")
            .text("Page Count");

        const sizeScale = d3.scaleSqrt()
            .domain([0, d3.max(data, d => d.opinionsCount)])
            .range([5, 30]);

        const bubbles = svg.selectAll(".bubble")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "bubble")
            .attr("cx", d => xScale(d.opinionsCount))
            .attr("cy", d => yScale(d.pageCount))
            .attr("r", d => sizeScale(d.opinionsCount))
            .style("fill", "steelblue")
            .style("opacity", 0.7)
            .style("stroke", "black")
            .style("stroke-width", 1);

        bubbles
            //when mouse hovers over the individual bubbles
            .on("mouseover", function (event, d) {
                d3.select(this).style("stroke", "orange").style("stroke-width", 3);
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(s`
                    <strong>Opinion Id: #</strong> ${d.id}<br>
                    <strong>Number Of Opinions:</strong> ${d.opinionsCount}<br>
                    <strong>Page Number:</strong> ${d.pageCount}<br>
                    <strong>Date Created:</strong> ${d.dateCreated}<br>
                    <span class="view-details" style="color: #008080; font-weight: bold;">Click to view details</span>
                `)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            //when mouse hovering off the individual bubbles
            .on("mouseout", function () {
                d3.select(this).style("stroke", "black").style("stroke-width", 1);
                tooltip.transition().duration(500).style("opacity", 0);
            })
            // clicking on the bubbles
            .on("click", function (event, d) {
                const detailsDiv = d3.select("#modal-details");
                detailsDiv.html(`
                    <strong>Opinion Id: #</strong> ${d.id}<br>
                    <strong>Number Of Opinions:</strong> ${d.opinionsCount}<br>
                    <strong>Page Count:</strong> ${d.pageCount}<br>
                    <strong>Lawyer:</strong> ${d.Lawyer}<br>
                    <strong>Date Created:</strong> ${d.dateCreated}<br>
                    <strong>Court:</strong> ${d.court}
                    <strong>Opinion Link:</strong> <a href="${d.cluster}" target="_blank" style="color: #008080;">View Opinion details</a>
                `);
                d3.select("#modal").style("display", "block");
            });

        // Dropdown menu change listener
        document.getElementById("page-filter").addEventListener("change", function () {
            const selectedPage = this.value;

            d3.selectAll(".bubble").style("stroke", "black").style("stroke-width", 1);

            if (selectedPage) {
                d3.selectAll(".bubble").filter(d => d.Document === selectedPage)
                    .style("stroke", "orange").style("stroke-width", 3);
            }
        });

        //close modal
        d3.select(".close").on("click", () => {
            d3.select("#modal").style("display", "none");
        });


        window.onclick = function (event) {
            if (event.target === d3.select("#modal").node()) {
                d3.select("#modal").style("display", "none");
            }
        };
    }

    let clickCount = 0;
    let chartCreated = false; // bool to ensure the user cannot spam and create multiple
    
    // Button click event to fetch legal opinions
    document.getElementById('fetch-legal-opinions').addEventListener('click', async () => {
        clickCount += 1;
    
        // Only execute if the chart has not been created
        if (!chartCreated && clickCount === 1) {
            const loadingMessage = document.getElementById('loading');
            const loadButton = document.querySelector('.button-container');
    
            loadingMessage.style.display = 'block'; 
            loadButton.style.display = 'none'; 
    
            //this wiil populate the dropdown menu for the bubble chart and also create the bubble chart
            await populatePageDropdown();
            await createBubbleChart();
    
            // Set chartCreated to true - prevents future chart creation/ duplicates of a chart
            chartCreated = true;
    
            loadingMessage.style.display = 'none';
        }
    });
});
