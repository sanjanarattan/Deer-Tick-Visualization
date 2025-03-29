const width = 1600;
const height = 800;

const SCALE = 8000;

function load(){
    d3.json("https://services6.arcgis.com/EbVsqZ18sv1kVJ3k/ArcGIS/rest/services/NYS_Civil_Boundaries/FeatureServer/2/query?f=geojson&where=1=1")
    .then(function(data){
        console.log("Data", data)
        console.log("Features count:", data.features.length)
        console.log("Head:", data.features.slice(0, 5))
        draw(data)
    })
}

function draw(data){
    const svg = d3.select("body")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height)

    var gfg = d3.geoAlbers()
        .scale(SCALE)
        .translate([width / 2 - 2100, height / 2 + 800])
        
    const path = d3.geoPath()
        .projection(gfg)
    
    
    svg.selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path) 
        .attr("fill", "#FFF")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)


}

load()
