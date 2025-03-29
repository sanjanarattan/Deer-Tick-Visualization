const width = 1200;
const height = 800;

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
    return
}

load()
