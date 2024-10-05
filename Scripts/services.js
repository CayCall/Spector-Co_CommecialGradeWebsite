document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('scrollButton').addEventListener('click', () => {
        document.querySelector('main').scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const apiKey = 'cs0q7h1r01qru183mr0gcs0q7h1r01qru183mr10'; // Finnhub API key
const fetchButton = document.getElementById('fetchButton');
const resultDiv = document.getElementById('result');
const limitLabel = document.getElementById('limitLabel');

let useCount = 0; // Initialize use count
const useLimit = 5; // Set the usage limit

fetchButton.addEventListener('click', () => {
    if (useCount < useLimit) {
        const symbol = document.getElementById('symbol').value;
        const apiUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                displayData(data, symbol);
                drawChart(data, symbol);
                useCount++; // Increment use count
                updateLimitLabel(); // Update the limit label
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                resultDiv.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
            });
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
        .range([400, 0]);

    svg.append("g")
        .attr("transform", "translate(0," + 400 + ")")
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

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
            // Show tooltip
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`${d.label}: $${d.value}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");

            // Change color on hover
            d3.select(this).attr("fill", "#FF5733");
        })
        .on("mouseout", function (d) {
            // Hide tooltip
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);

            // Reset color
            d3.select(this).attr("fill", "#4CAF50");
        });

    // Add labels with candle type names above the bars
    svg.selectAll(".label")
        .data(stockPrices)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d.label) + x.bandwidth() / 2) // Center the text
        .attr("y", d => y(d.value) - 5) // Position it above the bar
        .attr("dy", ".75em") // Adjust vertical positioning
        .attr("text-anchor", "middle") // Center align text
        .text(d => d.label); // Display the candle type name
}

function updateLimitLabel() {
    limitLabel.textContent = `You have used the fetch ${useCount} out of ${useLimit} times.`;
}
const accordions = document.querySelectorAll('.accordion');
accordions.forEach(accordion => {
    accordion.addEventListener('click', function () {
        // Toggle active class
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