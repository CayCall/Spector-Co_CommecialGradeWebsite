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
document.addEventListener('DOMContentLoaded', async () => {
    const CIK = "0000320193"; // Example CIK for Apple Inc.
    const apiUrl = `https://data.sec.gov/api/xbrl/companyfacts/CIK${CIK}.json`;

    // Define a function to fetch data
    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Extract financial data (e.g., Revenue, Net Income)
            const revenues = data.us_gaap.Revenues?.facts.map(fact => ({
                date: fact.period,
                value: fact.value
            }));
            const netIncome = data.us_gaap.NetIncomeLoss?.facts.map(fact => ({
                date: fact.period,
                value: fact.value
            }));

            return { revenues, netIncome };
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Fetch data and proceed if successful
    const { revenues } = await fetchData();
    if (!revenues) return; // Stop if revenues are not available

    // Set up SVG canvas and margins
    const margin = { top: 50, right: 100, bottom: 100, left: 100 };
    const width = 1000 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales for X (time) and Y (value)
    const x = d3.scaleTime()
        .domain(d3.extent(revenues, d => new Date(d.date)))
        .range([0, width]);
    const y = d3.scaleLinear()
        .domain([0, d3.max(revenues, d => d.value)])
        .range([height, 0]);

    // Define line generator function
    const line = d3.line()
        .x(d => x(new Date(d.date)))
        .y(d => y(d.value));

    // Create a path for the line chart
    svg.append("path")
        .datum(revenues)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Tooltip for displaying values on hover
    const tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("padding", "8px")
        .style("background", "white")
        .style("border", "1px solid #ccc")
        .style("display", "none");

    // Plot data points (dots) and attach tooltip interactions
    svg.selectAll(".dot")
        .data(revenues)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(new Date(d.date)))
        .attr("cy", d => y(d.value))
        .attr("r", 5)
        .attr("fill", d => {
            // Highlight peak and low points with specific colors
            const peak = d3.max(revenues, d => d.value);
            const low = d3.min(revenues, d => d.value);
            if (d.value === peak) return "green";
            if (d.value === low) return "red";
            return "blue";
        })
        .on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .html(`Date: ${d.date}<br>Value: $${d.value}`);
        })
        .on("mousemove", event => {
            tooltip.style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => tooltip.style("display", "none"));

    // Adding Axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")));

    svg.append("g")
        .call(d3.axisLeft(y));
});
