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

async function fetchCaseData() {
    const response = await fetch('https://www.courtlistener.com/api/rest/v3/cases/?format=json');
    const data = await response.json();
    return data.results; // Adjust based on actual data structure
}

// Create the D3 chart
async function createChart() {
    const cases = await fetchCaseData();

    // Sample case types and counts
    const caseCounts = {
        Criminal: 0,
        Civil: 0,
        Family: 0,
        Commercial: 0,
        // Add more types as needed
    };

    // Count cases by type (adjust based on actual data)
    cases.forEach(caseItem => {
        if (caseItem.type === 'Criminal') caseCounts.Criminal++;
        if (caseItem.type === 'Civil') caseCounts.Civil++;
        if (caseItem.type === 'Family') caseCounts.Family++;
        if (caseItem.type === 'Commercial') caseCounts.Commercial++;
    });

    const data = Object.entries(caseCounts).map(([type, count]) => ({ type, count }));

    // Set up the SVG canvas dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
          width = 800 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    // Create the SVG container
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set the x scale
    const x = d3.scaleBand()
        .domain(data.map(d => d.type))
        .range([0, width])
        .padding(0.1);

    // Set the y scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([height, 0]);

    // Add the x axis
    svg.append('g')
        .attr('class', 'axis--x')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Add the y axis
    svg.append('g')
        .attr('class', 'axis--y')
        .call(d3.axisLeft(y));

    // Create the bars
    svg.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.type))
        .attr('y', d => y(d.count))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.count));
}

// Call the function to create the chart
createChart();