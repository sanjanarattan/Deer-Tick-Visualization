var histWidth = 800
var histHeight = 400
var margin = { top: 20, right: 30, bottom: 40, left: 50 }

var histSVG = d3.select("#histogram")
    .append("svg")
    .attr("width", histWidth + margin.left + margin.right)
    .attr("height", histHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)


function histogram(data) {
    console.log("here")

    histSVG.selectAll("*").remove();

    data.forEach(d => d["Tick Population Density"] = +d["Tick Population Density"])

    var x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d["Tick Population Density"])])
        .range([0, histWidth])

    var histogramGen = d3.histogram()
        .value(d => d["Tick Population Density"])
        .domain(x.domain())
        .thresholds(x.ticks(20))

    var bins = histogramGen(data)

    var y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([histHeight, 0])

    histSVG.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", d => x(d.x0))
        .attr("y", d => y(d.length))
        .attr("width", d => x(d.x1) - x(d.x0) - 1)
        .attr("height", d => histHeight - y(d.length))
        .style("fill", "#fc8d62")

    histSVG.append("g")
        .attr("transform", `translate(0,${histHeight})`)
        .call(d3.axisBottom(x))

    histSVG.append("g")
        .call(d3.axisLeft(y))

  
}

