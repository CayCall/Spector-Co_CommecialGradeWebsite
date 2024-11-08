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


// Fetch data and create the visualization
const fetchDataAndCreateVisualization = () => {
    // Your API endpoint
    const docketEndpoint = '//www.courtlistener.com/api/rest/v4/dockets/';

    // Fetching docket data with Authorization token
    fetch(docketEndpoint, {
        method: 'GET',
        headers: {
            'Authorization': 'ea8f6170b3b99370b1a16b1009a9e0d221422953', // Add your Authorization token here
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching docket data');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data fetched successfully:', data);
            // Proceed to create the visualization
            createDocketVisualization(data);
        })
        .catch(error => {
            console.error('Error fetching docket data:', error);
        });
};

// Function to create docket visualization using D3.js
const createDocketVisualization = (data) => {
    // Ensure that data is an array and valid
    if (!Array.isArray(data)) {
        console.error('Invalid data format: Expected an array');
        return;
    }

    // Select the container element
    const svgContainer = d3.select('#docket');

    // Set up the SVG canvas dimensions
    const svg = svgContainer.append('svg')
        .attr('width', 500)
        .attr('height', 500);

    // Bind data to the rectangles (bars)
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d, i) => i * 30) // Set X position of the bars (spacing between them)
        .attr('y', (d) => 500 - (d.value || 0)) // Ensure a valid Y position for each rectangle
        .attr('width', 20) // Set fixed width of the rectangles
        .attr('height', (d) => {
            // Ensure the height is a valid number; fallback to 0 if not
            const height = d.value || 0;
            return isNaN(height) ? 0 : height; // Return 0 if height is NaN
        })
        .attr('fill', 'blue') // Set the color of the rectangles
        .on('mouseover', function (event, d) {
            // Tooltip on hover (optional)
            d3.select(this).attr('fill', 'orange');
            tooltip.transition().duration(200).style('opacity', 1);
            tooltip.html(`Docket: ${d.docketId} - Value: ${d.value}`)
                .style('left', `${event.pageX + 5}px`)
                .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', function () {
            // Tooltip removal
            d3.select(this).attr('fill', 'blue');
            tooltip.transition().duration(500).style('opacity', 0);
        });

    // Create a tooltip for interactivity
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background-color', '#f9f9f9')
        .style('padding', '5px')
        .style('border', '1px solid #ddd')
        .style('border-radius', '5px');

    // Optional: Add axis, labels, or other chart elements
    const xScale = d3.scaleLinear().domain([0, data.length]).range([0, 500]);
    const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).range([500, 0]);

    svg.append('g')
        .attr('transform', 'translate(0,500)')
        .call(d3.axisBottom(xScale));

    svg.append('g')
        .call(d3.axisLeft(yScale));
};

// Call the function to fetch data and create the visualization
fetchDataAndCreateVisualization();