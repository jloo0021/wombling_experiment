import { createIndicatorSliders, setDefaultWeights } from "./sliders.js";
import {
  initClickableWallBehaviour,
  initMapAreas,
  initMapBoundaries,
} from "./boundaries.js";
import { drawWalls } from "./womble.js";
import { toggleableLayers, colorCheck, heightCheck } from "./filter.js";
// import geoJsonData from "../liveability_sa1_2011_difference_buffered_transformed.geojson" assert { type: "json" };
// import boundaries_SA1_2011 from "../boundaries_SA1_2011_wgs84_buffered.geojson" assert { type: "json" };
import boundaries_SA1_2016 from "../boundaries_SA1_2016_wgs84_buffered7.geojson" assert { type: "json" };
import { createIndicatorOptions, getSelectValues, removeIndicatorOptions, getValues } from "./indicatorOptions.js";
import areas_SA1_2016 from "../SA1_2016_Greater_Melbourne.geojson" assert { type: "json" };
import { initCollapsibleBehaviour } from "./collapsible.js";
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
export let optionsData;
export function setIndicatorsData(data) {
  indicatorsData = data[0];
  data[1].shift();
  optionsData = data[1];

  var prevSelect = document.getElementById("indicators-selection");
  if (prevSelect.options.length) {
    
    const element = document.getElementById("indicators-selection");
    const divID = document.getElementById("selectionBlock");
    removeIndicatorOptions();
    element.remove();
    divID.appendChild(element);
    createIndicatorOptions(optionsData);
    

    new MultiSelectTag("indicators-selection");
    getValues();
  }
  else {
    createIndicatorOptions(optionsData);
    getValues();
    new MultiSelectTag("indicators-selection"); // id
    document.getElementById("selectionBlock").classList.remove("hide");
  }
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

initCollapsibleBehaviour();

map.addControl(new mapboxgl.NavigationControl());

let selectionSubmit = document.getElementById("submitOptions");
selectionSubmit.addEventListener("click", () => submitOptions());
function submitOptions() {
  let selectedValues = getSelectValues();
  console.log(selectedValues);
  createIndicatorSliders(selectedValues);
}

// add event listener to the button for resetting indicator weight sliders
let resetWeightsButton = document.getElementById("reset-weights-button");
resetWeightsButton.addEventListener("click", setDefaultWeights);

// button for drawing the edge heights based on womble calculation
// TODO: this event listener should be set in the function that handles the user's choice of boundaries. That function is not written yet, so the boundaries source is hardcoded.
// we need to pass the user's selected boundaries to the drawHeights function
let runWombleButton = document.getElementById("run-womble-button");
runWombleButton.addEventListener("click", () => {
  if (indicatorsData) {
    document.getElementById("loader").removeAttribute("hidden"); // show loading spinner
    setTimeout(drawWalls, 1, map, boundaries_SA1_2016); // 1 ms delay is required so that the loading spinner appears immediately before drawWalls is called, maybe see if there's a better way to do this
    // drawWalls(map, boundaries_SA1_2016);
  } else {
    console.log("Indicators data not found");
  }
});

// TODO: the run and reset buttons should be unhidden at the end of the function that handles the the user's selection of indicators. That function is not written yet so, for now
// it is being unhidden manually here
document.getElementById("womble-indicators-buttons").removeAttribute("hidden");

// when map loads, do...
map.on("load", () => {
  initMapBoundaries(map, areas_SA1_2016);
  initMapAreas(map, areas_SA1_2016);
  initClickableWallBehaviour(map);

  toggleableLayers(map);
  colorCheck(map);
  heightCheck(map);

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
