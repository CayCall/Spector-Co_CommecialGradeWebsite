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
    const API_URL = 'https://www.courtlistener.com/api/rest/v3/dockets/?page=1';
    let docketData = [];

    async function fetchDocketData() {
        if (docketData.length > 0) return docketData; // Return cached data if it already exists

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();

            // Log the raw data for debugging
            console.log(data);

            // Fetch additional details from docket URLs (if applicable)
            const docketDetailsPromises = data.results.map(async docket => {
                return await fetchDocketDetails(docket); // Pass docket for details fetching
            });

            docketData = await Promise.all(docketDetailsPromises);

            return docketData;
        } catch (error) {
            console.error('Error fetching docket data:', error);
            return []; // Return an empty array in case of error
        }
    }

    async function fetchDocketDetails(docket) {
        try {
            // Fetch detailed information from the docket URL
            const docketResponse = await fetch(docket.url);  // Assuming docket URL is stored in docket.url
            if (!docketResponse.ok) {
                throw new Error('Failed to fetch docket details: ' + docketResponse.statusText);
            }
            const docketDetails = await docketResponse.json();

            // Example of extracting relevant data from the docket details
            const docketNumber = docketDetails.docket_number || 'N/A';
            const caseTitle = docketDetails.case_title || 'Unknown Case';
            const courtName = docketDetails.court_name || 'Unknown Court';
            const filingDate = docketDetails.filing_date || 'Unknown Filing Date';

            return {
                id: docket.id,
                docketNumber: docketNumber,
                caseTitle: caseTitle,
                courtName: courtName,
                filingDate: filingDate,
                docketUrl: docket.url,
            };
        } catch (error) {
            console.error('Error fetching docket details:', error);
            return docket; // Return original docket if there’s an error
        }
    }

    async function populateDocketDropdown() {
        const data = await fetchDocketData();
        const dropdown = document.getElementById("docket-filter");

        const uniqueDockets = new Set(data.map(d => d.caseTitle));

        uniqueDockets.forEach(docket => {
            const option = document.createElement("option");
            option.value = docket;
            option.textContent = docket;
            dropdown.appendChild(option);
        });

        // Add event listener for dropdown changes
        dropdown.addEventListener('change', () => {
            highlightDocketBubble(dropdown.value);
        });
    }

    function highlightDocketBubble(selectedDocket) {
        const bubbles = d3.selectAll(".docket-bubble");
        bubbles.style("opacity", 0.7); // Reset all bubbles to default opacity

        if (selectedDocket) {
            bubbles.each(function (d) {
                if (d.caseTitle === selectedDocket) {
                    d3.select(this).style("opacity", 1) // Highlight the selected bubble
                        .style("stroke", "orange")
                        .style("stroke-width", 3);
                }
            });
        } else {
            bubbles.style("stroke", "black")
                .style("stroke-width", 1);
        }
    }

    async function createDocketBubbleChart() {
        const data = await fetchDocketData();

        const width = 1000;
        const height = 600;
        const margin = { top: 20, right: 20, bottom: 50, left: 50 };

        const svg = d3.select("#docket-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Scale for X-Axis (Docket Numbers)
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.docketNumber.length)])
            .range([0, width]);

        // Scale for Y-Axis (Filing Date)
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => new Date(d.filingDate).getFullYear())])
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
            .text("Docket Numbers");

        svg.append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 15)
            .style("text-anchor", "middle")
            .text("Filing Date");

        const sizeScale = d3.scaleSqrt()
            .domain([0, d3.max(data, d => d.docketNumber.length)])
            .range([5, 30]);

        const bubbles = svg.selectAll(".docket-bubble")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "docket-bubble")
            .attr("cx", d => xScale(d.docketNumber.length))
            .attr("cy", d => yScale(new Date(d.filingDate).getFullYear()))
            .attr("r", d => sizeScale(d.docketNumber.length))
            .style("fill", "green")
            .style("opacity", 0.7)
            .style("stroke", "black")
            .style("stroke-width", 1);

        bubbles
            .on("mouseover", function (event, d) {
                d3.select(this).style("stroke", "orange").style("stroke-width", 3);
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(`
                    <strong>Docket Id:</strong> #${d.id}<br>
                    <strong>Case Title:</strong> ${d.caseTitle}<br>
                    <strong>Filing Date:</strong> ${d.filingDate}<br>
                    <strong>Docket Number:</strong> ${d.docketNumber}<br>
                    <strong>Court Name:</strong> ${d.courtName}<br>
                    <strong>Docket Link:</strong> <a href="${d.docketUrl}" target="_blank" style="color: #008080; font-weight: bold;">View Docket</a>
                `)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {
                d3.select(this).style("stroke", "black").style("stroke-width", 1);
                tooltip.transition().duration(500).style("opacity", 0);
            })
            .on("click", function (event, d) {
                // Open modal with additional docket information
                showModal(d);
            });

        // Modal Functionality
        function showModal(data) {
            const modal = d3.select("#modal");
            modal.style("display", "block"); // Show the modal
    
            modal.select("#modal-details").html(`
                <h2>Docket Details</h2>
                <p><strong>Docket Id:</strong> #${data.id}</p>
                <p><strong>Case Title:</strong> ${data.caseTitle}</p>
                <p><strong>Filing Date:</strong> ${data.filingDate}</p>
                <p><strong>Docket Number:</strong> ${data.docketNumber}</p>
                <p><strong>Court Name:</strong> ${data.courtName}</p>
                <p><strong>Docket Link:</strong> <a href="${data.docketUrl}" target="_blank" style="color: #008080; font-weight: bold;">View Docket</a></p>
            `);
        }
    
        // Close Modal functionality
        d3.select(".close").on("click", function () {
            d3.select("#modal").style("display", "none"); // Hide the modal
        });
    
        // Close modal when clicking outside of the modal content
        d3.select("#modal").on("click", function (event) {
            if (event.target === this) {
                d3.select("#modal").style("display", "none");
            }
        });
    }

    populateDocketDropdown();
    createDocketBubbleChart();
});