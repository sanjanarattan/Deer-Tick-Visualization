function lineChart() {
    const counties = Array.from(new Set(TICKS.map(d => d.County))).sort()
    const countySelect = d3.select("#county-select")
    countySelect.selectAll("option")
      .data(counties)
      .enter().append("option")
        .text(d => d)
          .attr("value", d => d);
  
    countySelect.on("change", updateLine)
    d3.select("#tick-select")
      .on("change", updateLine)
  
    updateLine()
  }
  
  function updateLine() {
    const county   = d3.select("#county-select")
    .property("value")
    const tickType = d3.select("#tick-select")
    .property("value") 
    const climField = "AvgTemperature"
  
    const filteredRows = TICKS.filter(row => row.County == county);
    const mappedSeries = filteredRows.map(row => {
      return {
        year:  Number(row.Year),
        value: Number(row[tickType])
      };
    });

    const tickSeries = mappedSeries.sort((a, b) => {
      return a.year - b.year;
    });

  
    const climRow = CLIM.find(d => d.County == county)
    const climSeries = climRow
      ? Object.entries(climRow)
          .filter(([k]) => k !== "County")
          .map(([k,v]) => ({ year: +k, value: +v }))
          .sort((a, b) => a.year - b.year)
      : [];
  
  
    const svg           = d3.select("#line")
    svg.selectAll("*")
    .remove();
  
    const width  = +svg.attr("width");
    const height = +svg.attr("height");
    const m = { top: 80, right: 20, bottom: 50,left: 70}
  
    const x = d3.scaleLinear()
        .domain([2008, 2023])
        
        
        
        .range([m.left, width - m.right])
  
    const maxY = d3.max([
      d3.max(tickSeries, d => d.value),
      d3.max(climSeries, d => d.value)
    ]);
  
    const y = d3.scaleLinear()
        .domain([0, maxY]).nice()
        .range([height - m.bottom, m.top]);
  
    svg.append("g")
       .attr("transform", `translate(0,${height - m.bottom})`)
        .call(d3.axisBottom(x)
        .ticks(16)
        .tickFormat(d3.format("d")))
  
  const theWidth = width - m.left - m.right;

    svg.append("g")
       .attr("transform", `translate(${m.left},0)`)
       .call(d3.axisLeft(y))
       .call(
        d3.axisLeft(y)
        .tickSize(-theWidth)   
        .tickPadding(10)         
      )
      .call(g => g.selectAll(".tick line")
                  .attr("stroke", "#ccc")   
                  .attr("stroke-dasharray", "2,2"))
      .call(g => g.selectAll(".domain")
      .remove())
  
    const lineGen = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX)
  
    svg.append("path")
       .datum(tickSeries)
       .attr("fill", "none")
       .attr("stroke", "steelblue")
       .attr("stroke-width", 2)
       .attr("d", lineGen);
  
    svg.append("path")
       .datum(climSeries)
       .attr("fill", "none")
       .attr("stroke", "orange")
       .attr("stroke-width", 2)
       .attr("d", lineGen)
  
  
    svg.append("text")
       .attr("x", width / 2)
       .attr("y", m.top - 40)
       .attr("text-anchor", "middle")
       .text("${county}: ${tickType} (blue) vs ${climField} (orange)")

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", m.top - 25)
        .attr("text-anchor", "middle")
        .text("Keep in mind even just a 2 \u00B0 F increase in temperature is HUGE")
        .attr("font-size", "10px")
        .attr("fill", "grey")

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", m.top + 410)
        .attr("text-anchor", "middle")
        .text(`Year`)

    svg.append("text")
        .attr("x", m.left - 25)         
        .attr("y", (height - m.bottom + m.top) / 2)
        .attr("text-anchor", "middle")
        .attr("transform", `rotate(-90, ${m.left - 40}, ${(height- m.bottom + m.top) /2})`)
        .text("Property and \u00B0 F")       
    

  }
  
  