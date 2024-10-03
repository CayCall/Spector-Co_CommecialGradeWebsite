// check if elements rect is in viewport 
function isInViewport(element){
  const rect= element.getBoundingClientRect();
  return (
    rect.top <= window.innerHeight &&
    rect.bottom >= 0
  );

}
// used to call my animation for the p in  my content container item, just to add some dyamic animation 
function handleScroll(){
  const elements= document.querySelectorAll('.content-container-item p');
  elements.forEach((element) => {
    if (isInViewport(element)) {
      element.classList.add('animate');
    }
  });

}

// listen for scroll
window.addEventListener('scroll', handleScroll);

//lastly I call the animation
handleScroll();




// Fetch live crime data from the Police Data API (UK) link to the API must be included in the fetch function
fetch('https://data.police.uk/api/crimes-street/all-crime?lat=51.5074&lng=-0.1278')
  .then(response => response.json())
  .then(data => {
    //All crime categories are then iterated through and the crimecounts as an oject literal of those categories are also taken into account
    const crimeCounts = {};
    data.forEach(crime =>{
      if (crime.category in crimeCounts) {
        crimeCounts[crime.category]++;
      } else {
        crimeCounts[crime.category] = 1;
      }
    });

    // data  is prepared for the visualisation - sorting
    const crimeData = Object.keys(crimeCounts).map(category => ({
      name: category,
      count: crimeCounts[category]
    }));

    // descending order of data with a limitation of 10 total crimes
    const topCrimeData = crimeData.sort((a, b) => b.count - a.count).slice(0, 10);

    //// First step ensure all dimensions are setup for the bar graph
    const margin = { top: 20, right: 30, bottom: 40, left: 150 };
    const width = 700 - margin.left - margin.right;
    const height = 500- margin.top - margin.bottom;

    // Create the SVG container that will hold the bargraph, then append it to the "Bar-graph" id
    const svg = d3.select("#crime-bar-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // scales for the graph - 2 requirements X and Y graphs need an X and a Y scale
    const x = d3.scaleLinear()
      .range([0, width])
      .domain([0, d3.max(topCrimeData, d => d.count)]);

    const y = d3.scaleBand()
      .range([height, 0])
      .padding(0.1)
      .domain(topCrimeData.map(d => d.name));


    //  axes for the graph - again 2 requirements X and Y graphs need an X and a Y axes
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

    svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y).tickSizeOuter(0));

    // creation of the bars on the graph 
    svg.selectAll(".bar")
      .data(topCrimeData) // takes the crime data
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", d => y(d.name))
      .attr("height", y.bandwidth())
      .attr("width", d => x(d.count));

    // Labels for each bar
    svg.selectAll(".label")
      .data(topCrimeData)
      .enter().append("text")
      .attr("x", d => x(d.count) + 5)
      .attr("y", d => y(d.name) + y.bandwidth() / 2)
      .attr("dy", ".35em")
      .attr("class", "axis-label")
      .text(d => d.count);

  })

  // For checking if we are able to fetch the Live API
  .catch(error => {
    console.error("Error fetching data:", error);
  });