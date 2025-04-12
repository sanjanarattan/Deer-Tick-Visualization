function splom(data, year) {
    d3.select("#splom").selectAll("*").remove();

    const width = 800;
    const size = 200;
    const padding = 30;

    const dimensions = [
        "B. burgdorferi (%)",
        "A. phagocytophilum (%)",
        "B. microti (%)"
    ];

    const filtered = data
        .filter(d => +d.Year ==year)
        .map(d => {
            return {
                county: d.County,
                "B. burgdorferi (%)": +d["B. burgdorferi (%)"],
                "A. phagocytophilum (%)": +d["A. phagocytophilum (%)"],
                "B. microti (%)": +d["B. microti (%)"]
            };
        });

    const xScales = {}, yScales = {};
    dimensions.forEach(dim => {
        const extent = d3.extent(filtered, d => d[dim]);
        xScales[dim] = d3.scaleLinear().domain(extent).range([padding / 2, size - padding / 2]);
        yScales[dim] = d3.scaleLinear().domain(extent).range([size - padding / 2, padding / 2]);
    });

    const svg = d3.select("#splom")
        .append("svg")
        .attr("width", size * dimensions.length + padding)
        .attr("height", size * dimensions.length + padding)
        .append("g")
        .attr("transform", `translate(${padding},${padding / 2})`);

    for (let i = 0; i < dimensions.length; i++) {
        for (let j = 0; j < dimensions.length; j++) {
            const xVar = dimensions[j];
            const yVar = dimensions[i];

            const cell = svg.append("g")
                .attr("transform", `translate(${j * size},${i * size})`);

            cell.selectAll("circle")
                .data(filtered)
                .enter()
                .append("circle")
                .attr("cx", d => xScales[xVar](d[xVar]))
                .attr("cy", d => yScales[yVar](d[yVar]))
                .attr("r", 4)
                .style("fill", "#8da0cb")
                .style("opacity", 0.7);

            if (i ==dimensions.length - 1) {
                cell.append("g")
                    .attr("transform", `translate(0,${size - padding / 2})`)
                    .call(d3.axisBottom(xScales[xVar]).ticks(4).tickSize(2));
            }

            if (j == 0) {
                cell.append("g")
                    .attr("transform", `translate(${padding / 2},0)`)
                    .call(d3.axisLeft(yScales[yVar]).ticks(4).tickSize(2));
            }

            
        }
    }
}
