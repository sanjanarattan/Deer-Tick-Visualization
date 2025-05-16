/**
 * Initializes the distribution visualizations
 */
function distribution() {
    const properties = [
        "Tick Population Density",
        "B. burgdorferi (%)",
        "A. phagocytophilum (%)",
        "B. microti (%)",
        "B. miyamotoi (%)"
    ];

    // Clear previous visualizations
    d3.select("#som").selectAll("*").remove();
    d3.select("#histogram").selectAll("*").remove();

    SOM(properties);           // Draw correlation matrix for all properties
    HIST(properties[0]);       // Draw histogram for first property
}

/**
 * Draws a Self-Organizing Map (SOM) style correlation matrix of scatter plots.
 * Diagonal cells show property names, off-diagonal cells show scatter plots.
 * @param {string[]} properties - List of property names to visualize
 */
function SOM(properties) {
    const svgWidth = 400;
    const padding = 40;
    const size = (svgWidth - (padding * 2)) / properties.length;
    
    const svg = d3.select("#som");
    
    // Create scales for each property based on max data value
    const scales = {};
    properties.forEach(prop => {
        scales[prop] = d3.scaleLinear()
            .domain([0, d3.max(TICKS, d => +d[prop] || 0)])
            .range([size - 5, 5]);
    });
    
    for (let i = 0; i < properties.length; i++) {
        for (let j = 0; j < properties.length; j++) {
            const cell = svg.append("g")
                .attr("transform", `translate(${padding + j * size}, ${padding + i * size})`);
            
            // Cell background rectangle
            cell.append("rect")
                .attr("width", size)
                .attr("height", size)
                .attr("fill", "none")
                .attr("stroke", "#ccc")
                .attr("stroke-width", 1);
            
            const propX = properties[j];
            const propY = properties[i];
            
            if (i === j) {
                // Diagonal cell: show property name without "(%)"
                cell.append("text")
                    .attr("x", size / 2)
                    .attr("y", size / 2)
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "middle")
                    .style("font-size", "8px")
                    .style("font-weight", "bold")
                    .text(propX.replace(/ \(%\)$/, ''));
            } else {
                // Off-diagonal cell: scatter plot of propX vs propY
                const dots = cell.selectAll(".dot")
                    .data(TICKS.filter(d => d[propX] && d[propY]))
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("cx", d => scales[propX](+d[propX]))
                    .attr("cy", d => scales[propY](+d[propY]))
                    .attr("r", 2)
                    .attr("fill", "#ff7f0e")
                    .attr("opacity", 0.6)
                    .attr("cursor", "pointer")
                    // Tooltip on hover
                    .on("mouseover", function(event, d) {
                        d3.select(this).attr("r", 4).attr("fill", "#e31a1c");
                        const tooltip = d3.select("body").append("div")
                            .attr("class", "tooltip")
                            .style("opacity", 0)
                            .style("position", "absolute")
                            .style("background-color", "rgba(20, 20, 20, 0.9)")
                            .style("color", "white")
                            .style("padding", "8px")
                            .style("border-radius", "4px")
                            .style("font-size", "12px");
                        tooltip.transition().duration(200).style("opacity", 1);
                        tooltip.html(`County: ${d.County}<br>${propX}: ${d[propX]}<br>${propY}: ${d[propY]}`)
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 15) + "px");
                    })
                    .on("mouseout", function() {
                        d3.select(this).attr("r", 2).attr("fill", "#ff7f0e");
                        d3.selectAll(".tooltip").remove();
                    })
                    // On click, show histogram and highlight county
                    .on("click", (event, d) => {
                        createHistogram(propX, d.County);
                        highlightCounty(d.County);
                    });
            }
        }
    }
    
    // Title for the correlation matrix
    svg.append("text")
        .attr("x", svgWidth / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Correlation Matrix");
}

/**
 * Draws a histogram for the specified property.
 * Optionally highlights a specific county's value on the histogram.
 * @param {string} property - Property name for histogram
 * @param {string|null} [highlightCounty=null] - County name to highlight on the histogram
 */
function HIST(property, highlightCounty = null) {
    const svg = d3.select("#histogram");
    svg.selectAll("*").remove();
    
    const margin = { top: 30, right: 30, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    const data = TICKS.filter(d => d[property] != null && d[property] != undefined);
    
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d[property])])
        .range([0, width]);
    
    const histogram = d3.histogram()
        .value(d => +d[property])
        .domain(x.domain())
        .thresholds(x.ticks(20));
    
    const bins = histogram(data);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([height, 0]);
    
    // Draw bars
    chart.selectAll(".bar")
        .data(bins)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.x0))
        .attr("y", d => y(d.length))
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("height", d => height - y(d.length))
        .attr("fill", "#ff7f0e")
        .attr("opacity", 0.7);
    
    // X-axis
    chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");
    
    // Y-axis
    chart.append("g")
        .call(d3.axisLeft(y));
    
    // Histogram title
    svg.append("text")
        .attr("x", 200)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text(`Distribution of ${property}`);
    
    // X-axis label
    chart.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .attr("text-anchor", "middle")
        .text(property);
    
    // Y-axis label
    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .attr("text-anchor", "middle")
        .text("Frequency");
    
    // Highlight county on histogram, if provided
    if (highlightCounty) {
        const countyData = data.find(d => d.County === highlightCounty);
        if (countyData) {
            chart.append("line")
                .attr("x1", x(+countyData[property]))
                .attr("x2", x(+countyData[property]))
                .attr("y1", 0)
                .attr("y2", height)
                .attr("stroke", "red")
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "5,5");
            
            chart.append("text")
                .attr("x", x(+countyData[property]))
                .attr("y", 0)
                .attr("dy", "-0.5em")
                .attr("text-anchor", "middle")
                .attr("fill", "red")
                .text(highlightCounty);
        }
    }
}

/**
 * Highlights a county on the map by changing stroke width and color.
 * @param {string} county - Name of the county to highlight
 */
function highlightCounty(county) {
    d3.selectAll("#map path")
        .attr("stroke-width", d => {
            if (d.properties && d.properties.NAME === county) {
                return 3;
            }
            return 1;
        })
        .attr("stroke", d => {
            if (d.properties && d.properties.NAME === county) {
                return "#e31a1c";
            }
            return "#000";
        });
}

/**
 * Adds a dropdown selector for properties to visualize histograms.
 * On change, updates the histogram.
 */
function selector() {
    const properties = [
        "Tick Population Density",
        "B. burgdorferi (%)",
        "A. phagocytophilum (%)",
        "B. microti (%)",
        "B. miyamotoi (%)"
    ];
    
    const selector = d3.select(".content")
        .insert("div", ":first-child")
        .style("margin-bottom", "10px")
        .html(`
            <label for="property-select">Select Property for Histogram: </label>
            <select id="property-select">
                ${properties.map(p => `<option value="${p}">${p}</option>`).join('')}
            </select>
        `);
    
    d3.select("#property-select").on("change", function() {
        HIST(this.value);
    });
}

/**
 * Initializes the distribution visualization by setting up the selector
 * and rendering the initial distribution views.
 */
function initDistribution() {
    selector();
    distribution();
}
