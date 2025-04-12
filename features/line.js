function line(data) {
    const lineWidth = 800;
    const lineHeight = 400;
    const margin = { top: 40, right: 40, bottom: 40, left: 60 };

    d3.select("#line").selectAll("*").remove();

    const svg = d3.select("#line")
        .append("svg")
        .attr("width", lineWidth + margin.left + margin.right)
        .attr("height", lineHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    data.forEach(d => {
        d.Year = +d.Year;
        d["Tick Population Density"] = +d["Tick Population Density"];
    });

    const avgByYear = d3.rollup(
        data,
        v => d3.mean(v, d => d["Tick Population Density"]),
        d => d.Year
    );

    const formattedData = Array.from(avgByYear, ([year, value]) => ({ year, value }))
        .sort((a, b) => a.year - b.year);

    const x = d3.scaleLinear()
        .domain(d3.extent(formattedData, d => d.year))
        .range([0, lineWidth]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(formattedData, d => d.value)])
        .range([lineHeight, 0]);

    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.value));

    svg.append("path")
        .datum(formattedData)
        .attr("fill", "none")
        .attr("stroke", "#66c2a5")
        .attr("stroke-width", 2)
        .attr("d", line);

    svg.append("g")
        .attr("transform", `translate(0, ${lineHeight})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g")
        .call(d3.axisLeft(y));

}
