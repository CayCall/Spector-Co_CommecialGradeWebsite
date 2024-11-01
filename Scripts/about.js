document.addEventListener('DOMContentLoaded', () => {
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    const handleScroll = () => {
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            if (isInViewport(container)) {
                container.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    const handleLearnscroll = () => {
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            if (isInViewport(container)) {
                container.classList.add('visible');
            }
        });
    };


});



// Generating Dummy Data for 20 Pages
const API_URL = 'https://www.courtlistener.com/api/rest/v3/opinions/?page=1'; // Make sure the URL is correct
let legalData = [];

// Function to simulate fetching legal opinions data


function generateDummyData() {
    const data = [];
    for (let i = 1; i <= 20; i++) {
        data.push({
            id: 10642000 + i, // Example ID
            page: `Page ${i}`, // Page identifier
            court: `Court ${Math.ceil(Math.random() * 5)}`, // Randomly assign to one of 5 courts
            opinionsCount: Math.floor(Math.random() * 20) + 1, // Random opinions count between 1 and 20
            pageCount: Math.floor(Math.random() * 30) + 1, // Random page count between 1 and 30
            downloadUrl: `https://www.example.com/download/${10642000 + i}`, // Example download link
            dateCreated: new Date(new Date().setDate(new Date().getDate() - i)).toISOString().split('T')[0], // Date created (last 20 days)
            author: `Author ${i}`, // Example author
            absoluteUrl: `/opinion/${10642000 + i}/`, // Example absolute URL
        });
    }
    return data;
}

// Function to fetch legal opinions data (you can replace this with actual API data)
async function fetchLegalOpinions() {
    if (legalData.length > 0) return legalData; // Return cached data if already fetched

    // Simulating data fetch with dummy data
    legalData = generateDummyData();
    return legalData;
}

async function createBubbleChart() {
    // Fetching data
    const data = await fetchLegalOpinions();

    // Set up the chart dimensions
    const width = 1000;
    const height = 600;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

    // Process the data
    const pageCounts = {};
    data.forEach(opinion => {
        const page = opinion.page || 'Unknown';
        pageCounts[page] = opinion.opinionsCount || 0;
    });

    const pages = Object.keys(pageCounts);
    const counts = Object.values(pageCounts);

    // Create filter options
    pages.forEach(page => {
        d3.select("#page-filter").append("option").text(page).attr("value", page);
    });

    const maxCount = d3.max(counts);
    const sizeScale = d3.scaleSqrt().domain([0, maxCount]).range([5, 50]); // Adjust size for bubbles

    // Create bubbles
    const bubbles = svg.selectAll(".bubble")
        .data(pages)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("cx", (d, i) => (i % 10 + 1) * (width / 11)) // Arrange in rows of 10
        .attr("cy", (d, i) => Math.floor(i / 10) * 60 + 60) // Space rows apart
        .attr("r", (d, i) => sizeScale(pageCounts[d]))
        .style("fill", "steelblue")
        .on("mouseover", function (event, d) {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`Page: ${d}<br>Opinions: ${pageCounts[d]}<br>${data.find(op => op.page === d).importantInfo}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
            tooltip.transition().duration(500).style("opacity", 0);
        })
        .on("click", function (event, d) {
            const detailsDiv = d3.select("#details");
            detailsDiv.style("display", "block").html(`Page: ${d}<br>Opinions: ${pageCounts[d]}<br>${data.find(op => op.page === d).importantInfo}`);
        });

    // Filtering functionality
    d3.select("#page-filter").on("change", function () {
        const selectedPage = this.value;
        svg.selectAll(".bubble").style("opacity", 0.1);
        if (selectedPage === "all") {
            svg.selectAll(".bubble").style("opacity", 1);
        } else {
            svg.selectAll(".bubble").filter(d => d === selectedPage).style("opacity", 1);
        }
    });

    // Hide loading message
    d3.select("#loading").style("display", "none");
}

// Initialize the chart
createBubbleChart();