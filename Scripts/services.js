const accordions = document.querySelectorAll('.accordion');

accordions.forEach(accordion => {
    accordion.addEventListener('click', function() {
        this.classList.toggle('active');
        const panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
});

const apiKey = 'cs07dohr01qrbtrl99ngcs07dohr01qrbtrl99o0'; // Finnhub API key that I obtained through https://finnhub.io/dashboard
const fetchButton = document.getElementById('fetchButton');
const resultDiv = document.getElementById('result');

fetchButton.addEventListener('click', () => {
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
            drawChart(data, symbol); // Call a function that will draw the chart 
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            resultDiv.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        });
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
    svg.selectAll("*").remove(); // this will clearr the previous chart

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

    svg.selectAll(".bar")
        .data(stockPrices)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.label))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => 400 - y(d.value))
        .attr("fill", "#4CAF50");
}