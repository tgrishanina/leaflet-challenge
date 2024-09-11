// Creating the map object
let myMap = L.map("map", {
    center: [39.5, -98.35],
    zoom: 5
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to determine the marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 5; // Adjust the multiplier for size
}

// Function to determine the color based on depth
function getColor(depth) {
    return depth > 90 ? '#bd0026' :
           depth > 70 ? '#f03b20' :
           depth > 50 ? '#fd8d3c' :
           depth > 30 ? '#feb24c' :
           depth > 10 ? '#fed976' :
                        '#ffffb2';
}

// Getting our GeoJSON data
d3.json(link).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            // Get the magnitude and depth
            let magnitude = feature.properties.mag;
            let depth = feature.geometry.coordinates[2];

            // Create a circle marker with size and color based on magnitude and depth
            return L.circleMarker(latlng, {
                radius: markerSize(magnitude),
                fillColor: getColor(depth),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            // Add popups with information about the earthquake
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + " km<br>Location: " + feature.properties.place);
        }
    }).addTo(myMap);
});

// create a legend showing how marker colors correspond to depth
// Create a legend control
let legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let depths = [0, 10, 30, 50, 70, 90]; // Define the depth intervals
    let colors = [
        '#ffffb2', // 0-10
        '#fed976', // 10-30
        '#feb24c', // 30-50
        '#fd8d3c', // 50-70
        '#f03b20', // 70-90
        '#bd0026'  // >90
    ];
    
    // Add the title for the legend
    let legendInfo = "<h4>Depth (km)</h4>";
    div.innerHTML = legendInfo;

    // Loop through the depth intervals and colors to create legend items
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '; width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></i> ' +
            (depths[i] === depths[depths.length - 1] ? '+' + depths[i] : depths[i] + (depths[i + 1] ? ' - ' + depths[i + 1] : '')) + '<br>';
    }

    return div;
};

// Add the legend to the map
legend.addTo(myMap);
