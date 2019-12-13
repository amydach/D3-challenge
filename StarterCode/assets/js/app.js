// @TODO: YOUR CODE HERE!
// Copied and modified from 16-3-7

(async function(){
    const
        svgWidth = 960,
        svgHeight = 500;

    const margin = {
        top: 40,
        right: 40,
        bottom: 60,
        left: 60
    };

    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    const svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Import Data
    const censusData = await d3.csv("data.csv");

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function(data) {
        data.abbr = data.abbr;
        data.healthcare = data.healthcare;
        data.poverty = data.poverty;
    });

    // Step 2: Create scale functions
    // ==============================
    const xLinearScale = d3.scaleLinear()
        //.domain([26, d3.min(censusData, d => d.healthcare)])
        .domain([26, 0])
        .range([0, width]);

    const yLinearScale = d3.scaleLinear()
        //.domain([22, d3.min(censusData, d => d.poverty)])
        .domain([22, 8])
        .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    const circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
    //  .text(data.abbr)
        .attr("cx", d => xLinearScale(d.healthcare))
        .attr("cy", d => yLinearScale(d.poverty))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".5");

    // Step 5a: Add text to Circles
    // =================================
    var textGroup = chartGroup.selectAll("text.my-text")
        .data(censusData)
        .enter()
        .append("text")
        .classed("my-text", true)
        .attr("x", d => xLinearScale(d.healthcare))
        .attr("y", d => yLinearScale(d.poverty))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central") 
        .text(d => d.abbr)

    // Step 6: Initialize tool tip
    // ==============================
    const toolTip = d3
        .tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.abbr}<br>Healthcare: ${d.healthcare}<br>Poverty: ${d.poverty}`);
        });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Census Poverty");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .attr("class", "axisText")
        .text("Census Healthcare");
})()
