const width = 1600
const height = 800

const SCALE = 8000

var TICKS
var GEO

var gfg = d3.geoAlbers()
    .scale(SCALE)
    .translate([width / 2 - 2100, height / 2 + 800])

const path = d3.geoPath()
    .projection(gfg)

const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)



function load(){

    Promise.all([
        d3.json("https://services6.arcgis.com/EbVsqZ18sv1kVJ3k/ArcGIS/rest/services/NYS_Civil_Boundaries/FeatureServer/2/query?f=geojson&where=1=1"),
        d3.csv("../data/deer_ticks.csv"),
    ])
        .then(function([geo_data, tick_data]){
        //console.log("Data", data)
        //console.log("Features count:", data.features.length)
        //console.log("Head:", data.features.slice(0, 5))
        //console.log("Climate Data:", climate_data)
        GEO = geo_data
        TICKS = tick_data
        draw()
   })

}

function draw(){

    svg.selectAll("path")
        .data(GEO.features)
        .enter()
        .append("path")
        .attr("d", path) 
        .attr("fill", "#FFF")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)

    filter(2023, "Tick Population Density")
}

function filter(year, TYPE){

    var filtered
    filtered = TICKS.filter(d => d.Year == year)

    console.log("Filtered Data:", filtered)
    console.log(TYPE)

    
    color(filtered, TYPE)

}

function color(data, TYPE){

    //console.log("Filtered data:", data)
    //console.log("Max Density for year:", d3.max(data, d => d["Tick Population Density"]))
    //console.log("Names:", GEO.features.map(d => d.properties.NAME));


    //console.log(d3.max(data, d => d[TYPE]))

    const color_scale = d3.scaleSequential(d3.interpolateReds)
                          .domain([0, d3.max(data, d => d[TYPE])])

    svg.selectAll("path")
        .data(GEO.features)
        .attr("fill", function(d) {
            const county = data.find(tick => tick.County == d.properties.NAME)
            if (county) {
                return color_scale(county[TYPE])
            } else {
                return "#FFF"
            }
        })
}

load()

