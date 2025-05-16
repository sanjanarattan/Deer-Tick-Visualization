/**
 * Renders legend for displays
 */

const groups = ["Tick Population Density", "B. burgdorferi (%)", "A. phagocytophilum (%)", "B. microti (%)", "B. miyamotoi (%)"]


function render_legend() {

    const select = d3.select("#legend")
        .append("select")  
        .attr("id", "legend_select")

    select
        .selectAll("option")
        .data(groups)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d)
}


render_legend()

