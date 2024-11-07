document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(accordion => {
        accordion.addEventListener('click', function () {
            this.classList.toggle('active');

            // Get the panel
            const panel = this.nextElementSibling;

            // Toggle the panel display
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    });
});




document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetch-button'); // Updated ID
    const resultDiv = document.getElementById('result');
    const limitLabel = document.getElementById('limitLabel');

    const apiKey = 'cs0qc0pr01qru183mrugcs0qc0pr01qru183mrv0'; // Finnhub API key
    let useCount = 0; // Initialize use count
    const useLimit = 5;

    fetchButton.addEventListener('click', async () => {
        if (useCount < useLimit) {
            const symbol = document.getElementById('symbol').value;
            const apiUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                const data = await response.json();
                displayData(data, symbol);
                drawChart(data, symbol);
                useCount++; // Increment use count
                updateLimitLabel();
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
                resultDiv.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
            }
        } else {
            resultDiv.innerHTML = '<p>Usage limit reached. Please refresh the page to reset.</p>';
            fetchButton.disabled = true; // Disable the button if limit is reached
        }
    });

    function displayData(data, symbol) {
        if (data) {
            const html = `
                <h2>Stock Data for ${symbol}</h2>
                <p><strong>Current Price:</strong> $${data.c}</p>
                <p><strong>High Price of the Day:</strong> $${data.h}</p>
                <p><strong>Low Price of the Day:</strong> $${data.l}</p>
                <p><strong>Open Price of the Day:</strong> $${data.o}</p>
                <p><strong>Previous Close Price:</strong> $${data.pc}</p>
            `;
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = '<p>No data available</p>';
        }
    }

    function drawChart(data, symbol) {
        const svg = d3.select("#chart");
        svg.selectAll("*").remove(); // Clear the previous chart

        const stockPrices = [
            { label: "Current Price", value: data.c },
            { label: "High Price", value: data.h },
            { label: "Low Price", value: data.l },
            { label: "Open Price", value: data.o },
            { label: "Previous Close", value: data.pc }
        ];

        const x = d3.scaleBand()
            .range([0, 600])
            .domain(stockPrices.map(d => d.label))
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(stockPrices, d => d.value)])
            .range([400, 20]);

        svg.append("g")
            .attr("transform", "translate(0," + 400 + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("fill", "#000");

        svg.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .attr("fill", "#000");

        // Create a tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Create bars
        svg.selectAll(".bar")
            .data(stockPrices)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.label))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => 400 - y(d.value))
            .attr("fill", "#4CAF50")
            .on("mouseover", function (event, d) {
                // to show tooltip
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`${d.label}: $${d.value}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");

                d3.select(this).attr("fill", "#FF5733");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);

                // Reset the colour
                d3.select(this).attr("fill", "#4CAF50");
            });
        svg.selectAll(".label")
            .data(stockPrices)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", d => x(d.label) + x.bandwidth() / 2)
            .attr("y", d => y(d.value)) // Adjusted to move labels higher
            .attr("dy", "2em")
            .attr("text-anchor", "middle")
            .attr("fill", "#E5E5E5 !important")
            .text(d => d.label);

    }

    function updateLimitLabel() {
        limitLabel.textContent = `You have used the fetch ${useCount} out of ${useLimit} times.`;
    }
});


fetch('https://data.police.uk/api/crimes-street/all-crime?lat=51.5074&lng=-0.1278')
    .then(response => response.json())
    .then(data => {
        // Counting crime categories with additional data attributes
        const crimeCounts = {};
        data.forEach(crime => {
            const { category, location, outcome_status } = crime;
            if (category in crimeCounts) {
                crimeCounts[category].count++;
            } else {
                crimeCounts[category] = {
                    count: 1,
                    exampleLocation: location.street.name,
                    exampleOutcome: outcome_status ? outcome_status.category : "Unknown"
                };
            }
        });

        // Data preparation for visualization, sorted by top crimes
        const crimeData = Object.keys(crimeCounts).map(category => ({
            name: category,
            count: crimeCounts[category].count,
            exampleLocation: crimeCounts[category].exampleLocation,
            exampleOutcome: crimeCounts[category].exampleOutcome
        }));

        // Top 10 categories by crime count
        const topCrimeData = crimeData.sort((a, b) => b.count - a.count).slice(0, 10);

        // Setup dimensions for the bubble chart
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = 1100 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // Create the SVG container
        const svg = d3.select("#crime-bubble-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        // Scales for bubble sizes
        const radiusScale = d3.scaleSqrt()
            .domain([0, d3.max(topCrimeData, d => d.count)])
            .range([10, 50]);

        // Color scale for specific categories
        const colorScale = d3.scaleOrdinal()
            .domain(topCrimeData.map(d => d.name))
            .range([
                "#4A90E2", "#50E3C2", "#F5A623", "#D0021B", "#7B92A1", 
                "#B8E986", "#8B572A", "#9B9B9B", "#F8E71C", "#BD10E0"
            ]);

        // Force simulation to arrange bubbles with more space
        const simulation = d3.forceSimulation(topCrimeData)
            .force("charge", d3.forceManyBody().strength(-20))  // Increased strength for better spacing
            .force("center", d3.forceCenter(0, 0))
            .force("collision", d3.forceCollide(d => radiusScale(d.count) + 10))  // Adjust collision for more space
            .on("tick", ticked);

        function ticked() {
            const circles = svg.selectAll("circle")
                .data(topCrimeData, d => d.name);

            circles.enter()
                .append("circle")
                .attr("r", d => radiusScale(d.count))
                .attr("fill", d => colorScale(d.name)) // Apply color based on crime category
                .attr("stroke", "#333")
                .attr("stroke-width", 1)
                .merge(circles)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            circles.exit().remove();

            // Add labels to each bubble
            const labels = svg.selectAll(".label")
                .data(topCrimeData, d => d.name);

            labels.enter()
                .append("text")
                .attr("class", "label")
                .attr("dy", ".35em")
                .style("text-anchor", "middle")
                .merge(labels)
                .attr("x", d => d.x)
                .attr("y", d => d.y)
                .text(d => `${d.name} (${d.count})`);

            labels.exit().remove();
        }

        // Ensure the tooltip is in the DOM
        const tooltip = d3.select("body").append("div")
            .attr("id", "tooltip")
            .style("position", "absolute")
            .style("opacity", 0)
            .style("background-color", "rgba(0,0,0,0.7)")
            .style("color", "white")
            .style("padding", "10px")
            .style("border-radius", "5px");

        // Optional tooltip for additional details on hover
        svg.selectAll("circle")
            .on("mouseover", function(event, d) {
                tooltip.style("opacity", 1)
                    .html(`
                        <strong>Crime Category:</strong> ${d.name}<br>
                        <strong>Crime counts:</strong> ${d.count}<br>
                        <strong>Location Example:</strong> ${d.exampleLocation}<br>
                        <strong>Outcome:</strong> ${d.exampleOutcome}
                    `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 30) + "px");

                // Add hover effect to change circle style
                d3.select(this)
                    .style("fill", "#FF6347") // Change color on hover
                    .style("cursor", "pointer");  // Show pointer cursor
            })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 30) + "px");
            })
            .on("mouseout", function() {
                tooltip.style("opacity", 0);

                // Reset the circle style when the mouse is no longer hovering over it
                d3.select(this)
                    .style("fill", d => colorScale(d.name))  // Reset original color
                    .style("cursor", "default");
            });
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
