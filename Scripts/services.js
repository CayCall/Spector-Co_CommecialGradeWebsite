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

const apiKey = 'cs0qc0pr01qru183mrugcs0qc0pr01qru183mrv0'; // Finnhub API key
const fetchButton = document.getElementById('fetchButton');
const resultDiv = document.getElementById('result');
const limitLabel = document.getElementById('limitLabel');

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
        .attr("y", d => y(d.value) - 5) 
        .attr("dy", ".75em") 
        .attr("text-anchor", "middle") 
        .text(d => d.label); 
}

function updateLimitLabel() {
    limitLabel.textContent = `You have used the fetch ${useCount} out of ${useLimit} times.`;
}

// Set up the SVG element
const svg = d3.select("svg");
const margin = {top: 20, right: 30, bottom: 40, left: 40};
const width = +svg.attr("width") - margin.left - margin.right;
const height = +svg.attr("height") - margin.top - margin.bottom;

const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

// Sample data (replace with API data)
const data = [
    {date: "2020-01-01", value: 10},
    {date: "2020-02-01", value: 20},
    {date: "2020-03-01", value: 30},
    {date: "2020-04-01", value: 40},
    {date: "2020-05-01", value: 50}
];

// Parse the date
const parseTime = d3.timeParse("%Y-%m-%d");
data.forEach(d => {
    d.date = parseTime(d.date);
});

// Create scales
const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([height, 0]);

// Create axes
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

g.append("g")
    .attr("class", "axis axis--y")
    .call(yAxis);

// Create the line
const line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.value));

g.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "steelblue");

// Add a transition effect
g.selectAll("path")
    .transition()
    .duration(1000)
    .attr("stroke", "orange");