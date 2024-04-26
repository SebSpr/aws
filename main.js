/* Wetterstationen Euregio Beispiel */

// Innsbruck
let ibk = {
    lat: 47.267222,
    lng: 11.392778
};

// Karte initialisieren
let map = L.map("map", {
    fullscreenControl: true
}).setView([ibk.lat, ibk.lng], 11);

// thematische Layer
let themaLayer = {
    stations: L.featureGroup().addTo(map)
}

// Hintergrundlayer
L.control.layers({
    "Relief avalanche.report": L.tileLayer(
        "https://static.avalanche.report/tms/{z}/{x}/{y}.webp", {
        attribution: `© <a href="https://sonny.4lima.de">Sonny</a>, <a href="https://www.eea.europa.eu/en/datahub/datahubitem-view/d08852bc-7b5f-4835-a776-08362e2fbf4b">EU-DEM</a>, <a href="https://lawinen.report/">avalanche.report</a>, all licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>`
    }).addTo(map),
    "Openstreetmap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Esri WorldTopoMap": L.tileLayer.provider("Esri.WorldTopoMap"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery")
}, {
    "Wetterstationen": themaLayer.stations
}).addTo(map);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

// GeoJSON der Wetterstationen laden
async function showStations(url) {
    //console.log("Loading", url)
    var response = await fetch(url);
    var geojson = await response.json();
    L.geoJSON(geojson, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
              icon: L.icon({
                iconUrl: "icons/wifi.png",
                iconAnchor: [16, 37],
                popupAnchor: [0, -37],
      
              })
            });
          },
        onEachFeature: function (feature, layer) {
            //console.log(feature);
            //console.log(feature.properties.name);
            layer.bindPopup(`
            <h4><p> ${feature.properties.name} (${feature.geometry.coordinates[2]}m)</p></h4>
            <ul>
            <li>Lufttemperatur (&deg;C): ${feature.properties.LT || "-"}</li>
            <li>Relative Luftfeuchte (%): ${feature.properties.RH || "-"}</li>
            <li>Windgeschwindigkeit (km/h): ${feature.properties.WG || "-"}</li>
            <li>Schneehöhe (cm): ${feature.properties.GS_O|| "-"} </li>
            </ul>
            <p>${feature.properties.date}</p>
            `)
            // Stimmt .WG und .GS_O wirklich? die Werte sehen nicht richtig aus?...
          }
        }).addTo(themaLayer.stations);
      }

showStations("https://static.avalanche.report/weather_stations/stations.geojson");

