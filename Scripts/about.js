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
}

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

        async function fetchLegalOpinions() {
            if (legalData.length > 0) return legalData; // Return cached data if it already exists
        
            try {
                const response = await fetch(API_URL, {
                    headers: {
                        'Authorization': 'Token ea8f6170b3b99370b1a16b1009a9e0d221422953' // Replace with your actual API key
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                const data = await response.json();
        
                // Log the raw data for debugging
                console.log(data);
        
                // Initialize the opinions count
                let opinionsCount = 0;
        
                // Fetch details from cluster URLs
                const opinionsPromises = data.results.map(async opinion => {
                    opinionsCount++; // Increment the opinions count for each opinion
                    return await fetchOpinionDetails(opinion, opinionsCount); // Pass count to details fetching
                });
        
                legalData = await Promise.all(opinionsPromises);
        
                return legalData;
            } catch (error) {
                console.error('Error fetching legal opinions:', error);
                return []; // Return an empty array in case of error
            }
        }
    }
    async function fetchOpinionDetails(opinion) {

        // Fetch the case details from the cluster URL
        try {
            const clusterResponse = await fetch(opinion.cluster);
            if (!clusterResponse.ok) {
                throw new Error('Failed to fetch opinion details: ' + clusterResponse.statusText);
            }
            const clusterData = await clusterResponse.json();
            // Extract necessary data from clusterData
            const caseName = clusterData.case_name || 'Unknown Case';
            const docketUrl = clusterData.docket || null;
            let natureOfSuit = 'Unknown Nature of Suit';

            // Fetch nature_of_suit from docket URL if it exists
            if (docketUrl) {
                natureOfSuit = await fetchNatureOfSuit(docketUrl);
            }

            return {
                id: opinion.id,
                Document: caseName, // Use case name from cluster data
                opinionsCount: opinion.opinions_count || 1,
                pageCount: opinion.page_count || 0,
                dateCreated: opinion.date_created || new Date().toISOString().split('T')[0],
                courtType: opinion.court || '100trialcourt',
                clusterUrl: opinion.cluster || '#',
                natureOfSuit: natureOfSuit // Add nature_of_suit to the returned object
            };
        } catch (error) {
            console.error('Error fetching opinion details:', error);
            return opinion; // Return original opinion in case of error
        }
    }

    async function fetchNatureOfSuit(docketUrl) {
        try {
            const docketResponse = await fetch(docketUrl);
            if (!docketResponse.ok) {
                throw new Error('Failed to fetch docket details: ' + docketResponse.statusText);
            }
            const docketData = await docketResponse.json();
            // Extract nature_of_suit from docket data
            return docketData.nature_of_suit || 'Confidential Information'; // Default value if not found
        } catch (error) {
            console.error('Error fetching nature_of_suit:', error);
            return 'Error fetching nature of suit'; // Return an error message in case of failure
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

        // Scale for X-Axis (Opinions Count)
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.opinionsCount) + 1])
            .range([0, width]);

        // Scale for Y-Axis (Page Count)
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
            .on("mouseover", function (event, d) {
                d3.select(this).style("stroke", "orange").style("stroke-width", 3);
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(`
                    <strong>Opinion Id:</strong> #${d.id}<br>
                    <strong>Number Of Opinions:</strong> ${d.opinionsCount}<br>
                    <strong>Page Count:</strong> ${d.pageCount}<br>
                    <strong>Date Created:</strong> ${d.dateCreated}<br>
                    <strong>Document:</strong> ${d.Document}<br>
                    <strong>Nature of Suit:</strong> ${d.natureOfSuit}<br>
                    <strong>Opinion Link:</strong> <a href="${d.clusterUrl}" target="_blank" style="color: #008080; font-weight: bold;">View Opinion</a>
                `)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {
                d3.select(this).style("stroke", "black").style("stroke-width", 1);
                tooltip.transition().duration(500).style("opacity", 0);
            })
            .on("click", function (event, d) {
                // Open modal with additional information
                showModal(d);
            });

        // Modal Functionality
        function showModal(data) {
            const modal = d3.select("#modal");
            modal.style("display", "block"); // Show the modal
    
            modal.select("#modal-details").html(`
                <h2>Opinion Details</h2>
                <p><strong>Opinion Id:</strong> #${data.id}</p>
                <p><strong>Document:</strong> ${data.Document}</p>
                <p><strong>Date Created:</strong> ${data.dateCreated}</p>
                <p><strong>Nature of Suit:</strong> ${data.natureOfSuit}</p>
                <p><strong>Opinion Link:</strong> <a href="${data.clusterUrl}" target="_blank" style="color: #008080; font-weight: bold;">View Opinion</a></p>
            `);
        }
    
        // Close Modal functionality
        d3.select(".close").on("click", function () {
            d3.select("#modal").style("display", "none"); // Hide the modal
        });
    
        // Close modal when clicking outside of the modal content
        d3.select("#modal").on("click", function (event) {
            if (event.target === this) { // Check if the target is the modal background
                d3.select("#modal").style("display", "none");
            }
        });
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
