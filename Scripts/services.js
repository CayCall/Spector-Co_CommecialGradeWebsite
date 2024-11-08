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
            fetchButton.disabled = true; 
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

  const updateLimitLabel = () => {
        limitLabel.textContent = `You have used the fetch ${useCount} out of ${useLimit} times.`;
    }



    // Docket visulisation


    // Function to fetch data and create the docket visualisation
    const fetchDataAndCreateVisualisation = () => {
        const docketEndpoint = 'https://www.courtlistener.com/api/rest/v4/dockets/';

        fetch(docketEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ea8f6170b3b99370b1a16b1009a9e0d221422953', // Authorization token
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching docket data');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched Data:', data);
                createDocketVisualisation(data.results); // Use `results` if data is wrapped in that
            })
            .catch(error => {
                console.error('Error fetching docket data:', error);
            });
            
    };


    // Function to create docket visualization
    const createDocketVisualisation = (data) => {
        // Ensure data is an array
        if (!Array.isArray(data)) {
            console.error('Invalid data format: Expected an array');
            return;
        }

        // Creates the table for docket information
        const table = d3.select('#docketTable')
            .append('table')
            .attr('class', 'docket-table');

        const tableHeader = table.append('thead').append('tr');
        tableHeader.append('th').text('Case Name');
        tableHeader.append('th').text('Docket Number');
        tableHeader.append('th').text('Case Link');
        tableHeader.append('th').text('Date Filed');
        tableHeader.append('th').text('Cause');
        tableHeader.append('th').text('Assigned Judge');
        tableHeader.append('th').text('Date Last Filing');

        const tableBody = table.append('tbody');

        const renderTable = (data) => {
            tableBody.selectAll('*').remove(); 

            data.forEach(d => {
                const row = tableBody.append('tr')
                    .attr('data-url', `//www.courtlistener.com/api/rest/v4/dockets/${d.id}/`);  //https://www.courtlistener.com/api/rest/v4/dockets/69354754/ - follow it so add id
                row.append('td').text(d.case_name || 'N/A');
                row.append('td').text(d.docket_number || 'N/A');
                row.append('td').text(d.resource_uri|| 'N/A');
                row.append('td').text(d.date_created || 'N/A');
                row.append('td').text(d.cause || 'N/A');
                row.append('td').text(d.assigned_to_str || 'N/A');
                row.append('td').text(d.date_last_filing || 'N/A');

                // Add click event to the row
                row.on('click', function () {
                    const url = this.getAttribute('data-url');  
                    window.open(url, '_blank'); 
                });

                // Optional: Highlight row on hover
                row.on('mouseover', function () {
                    d3.select(this).style('background-color', '#e0e0e0'); 
                }).on('mouseout', function () {
                    d3.select(this).style('background-color', ''); 
                });
            });
        };

        // Initially render the table
        renderTable(data);


        // 3. Sorting functionality based on checkbox
        const sortCheckbox = document.getElementById('sortCheckbox');
        sortCheckbox.addEventListener('change', () => {
            const isChecked = sortCheckbox.checked;
            const sortedData = [...data];  // Clone data to avoid mutation

            if (isChecked) {
                sortedData.sort((a, b) => new Date(a.date_created) - new Date(b.date_created));  // Sort by Date Filed Ascending
            } else {
                sortedData.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));  // Sort by Date Filed Descending
            }

            renderTable(sortedData);  // Re-render the table with sorted data
        });
    };
    // Function to implement search functionality
    const searchTable = () => {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();  
        const rows = document.querySelectorAll('#docketTable tbody tr'); 

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');  
            let match = false;  

            
            cells.forEach(cell => {
                if (cell.textContent.toLowerCase().includes(searchTerm)) {
                    match = true;  
                }
            });

            // If a match is found, show the row, otherwise hide it
            if (match) {
                row.style.display = '';  
            } else {
                row.style.display = 'none'; 
            }
        });
    };

    
    document.getElementById('searchInput').addEventListener('input', searchTable);
    fetchDataAndCreateVisualisation();
});


