import { createIndicatorSliders, setDefaultWeights } from "./sliders.js";
import { initMapBoundaries } from "./boundaries.js";
import { drawWalls } from "./womble.js";
import { toggleableLayers } from "./filter.js";
// import geoJsonData from "../liveability_sa1_2011_difference_buffered_transformed.geojson" assert { type: "json" };
// import boundaries_SA1_2011 from "../boundaries_SA1_2011_wgs84_buffered.geojson" assert { type: "json" };
import boundaries_SA1_2016 from "../boundaries_SA1_2016_wgs84_buffered7.geojson" assert { type: "json" };
// console.log(geoJsonData);

// Could also use fetch instead of import
// fetch("./boundaries_SA1_2016.geojson")
//   .then((response) => {
//     return response.json();
//   })
//   .then((data) => console.log(data));

// mapbox token (taken from existing project)
const MAPBOX_TOKEN =
  "pk.eyJ1IjoibmR1bzAwMDMiLCJhIjoiY2tnNHlucmF3MHA4djJ6czNkaHRycmo1OCJ9.xfU4SWH35W5BYtJP8VnTEA";

// elements for the transparency slider
let transparencySlider = document.getElementById("transparency-slider");
let transparencySliderValue = document.getElementById(
  "transparency-slider-value"
);

// variable for the csv data is made global
export let indicatorsData;
export function setIndicatorsData(data) {
  indicatorsData = data;
}

export let map = new mapboxgl.Map({
  container: "map",
  // center: [144.9631, -37.9631], // long lat of melb
  center: [145.2, -37.817], // long lat of east side melb
  // center: [149.8911094722651, -35.0898882056091],
  zoom: 10,
  style: "mapbox://styles/mapbox/light-v11",
  accessToken: MAPBOX_TOKEN,
  pitch: 45,
  bearing: -17.6,
  antialias: true,
});

map.addControl(new mapboxgl.NavigationControl());
createIndicatorSliders([
  "dwelling",
  "person",
  "urban_liveability_index",
  "social_infrastructure_mix",
  "walkability",
  "local_employment",
  "closest_pos",
  "closest_healthy_food",
]); // hardcoded for now, TODO: retrieve user's selected indicators and pass them as args to this function

// add event listener to the button for resetting indicator weight sliders
let resetWeightsButton = document.getElementById("reset-weights-button");
resetWeightsButton.addEventListener("click", setDefaultWeights);

// button for drawing the edge heights based on womble calculation
// TODO: this event listener should be set in the function that handles the user's choice of boundaries. That function is not written yet, so the boundaries source is hardcoded.
// we need to pass the user's selected boundaries to the drawHeights function
let runWombleButton = document.getElementById("run-womble-button");
runWombleButton.addEventListener("click", () =>
  drawWalls(map, boundaries_SA1_2016)
);

// TODO: the run and reset buttons should be unhidden at the end of the function that handles the the user's selection of indicators. That function is not written yet so, for now
// it is being unhidden manually here
document.getElementById("womble-indicators-buttons").removeAttribute("hidden");

// when map loads, do...
map.on("load", () => {
  initMapBoundaries(map, boundaries_SA1_2016);

  toggleableLayers(map);

  transparencySlider.addEventListener("input", (e) => {
    // adjust the boundary layer's fill-extrusion-opacity value. If you change the id of the boundary layer you'll also have to change it here
    map.setPaintProperty(
      "walls",
      "fill-extrusion-opacity",
      parseInt(e.target.value, 10) / 100
    );
    // value indicator
    transparencySliderValue.textContent = e.target.value + "%";
  });
});
