import { drawBoundary } from "./boundaries.js";
// import geoJsonData from "../dummy.geojson" assert { type: "json" }; // dummy data based on liveability geojson, with some coordinates manually converted using epsg.io
// import geoJsonData from "../aus_sa1_2021_simplified.geojson" assert { type: "json" };
// import geoJsonData from "../test.geojson" assert { type: "json" };
// import geoJsonData from "../boundaries_SA1_2016.geojson" assert { type: "json" };
// import geoJsonData from "../liveability_sa1_2011_difference_modified.geojson" assert { type: "json" };
import geoJsonData from "../liveability_geojson.geojson" assert { type: "json" };
console.log(geoJsonData);

// mapbox token (taken from existing project)
const MAPBOX_TOKEN =
  "pk.eyJ1IjoibmR1bzAwMDMiLCJhIjoiY2tnNHlucmF3MHA4djJ6czNkaHRycmo1OCJ9.xfU4SWH35W5BYtJP8VnTEA";

// elements for the transparency slider
let slider = document.getElementById("slider");
let sliderValue = document.getElementById("slider-value");

let map = new mapboxgl.Map({
  container: "map",
  // center: [144.9631, -37.9631], // long lat of melb
  // center: [145.2, -37.817], // long lat of east side melb
  center: [144.97182686972909, -37.758453211610004],
  zoom: 10,
  style: "mapbox://styles/mapbox/light-v11",
  accessToken: MAPBOX_TOKEN,
  pitch: 45,
  bearing: -17.6,
  antialias: true,
});

map.addControl(new mapboxgl.NavigationControl());

// when map loads, do...
map.on("load", () => {
  drawBoundary(map, geoJsonData);

  slider.addEventListener("input", (e) => {
    // adjust the boundary layer's fill-extrusion-opacity value. If you change the id of the boundary layer you'll also have to change it here
    map.setPaintProperty(
      "boundary",
      "fill-extrusion-opacity",
      parseInt(e.target.value, 10) / 100
    );
    // value indicator
    sliderValue.textContent = e.target.value + "%";
  });
});
