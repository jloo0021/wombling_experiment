import { createIndicatorSliders, setDefaultWeights } from "./sliders.js";
import {
  initClickableWallBehaviour,
  initMapAreas,
  initMapBoundaries,
} from "./boundaries.js";
import { drawWalls } from "./womble.js";
import { toggleableLayers } from "./filter.js";
// import geoJsonData from "../liveability_sa1_2011_difference_buffered_transformed.geojson" assert { type: "json" };
// import boundaries_SA1_2011 from "../boundaries_SA1_2011_wgs84_buffered.geojson" assert { type: "json" };
import boundaries_SA1_2016_buffered from "../boundaries_SA1_2016_wgs84_buffered7.geojson" assert { type: "json" };
import boundaries_SA1_2016 from "../boundaries_SA1_2016_wgs84.geojson" assert { type: "json" };
import { createIndicatorOptions, getSelectValues } from "./indicatorOptions.js";
import areas_SA1_2016 from "../SA1_2016_Greater_Melbourne.geojson" assert { type: "json" };
import { initCollapsibleBehaviour } from "./collapsible.js";
import { DimensionToggle } from "./DimensionToggle.js";
import { Dimensions } from "./enums.js";
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

  createIndicatorOptions(optionsData);
  new MultiSelectTag("indicators-selection"); // id
  document.getElementById("selectionBlock").classList.remove("hide");
}

// another global to store the dimension that the app is currently in (2d or 3d)
export let appDimension = Dimensions.TWO_D;
export function setDimension(dimension) {
  appDimension = dimension;
}

export let map = new mapboxgl.Map({
  container: "map",
  // center: [144.9631, -37.9631], // long lat of melb
  center: [145.2, -37.817], // long lat of east side melb
  // center: [149.8911094722651, -35.0898882056091],
  zoom: 10,
  maxPitch: 0,
  style: "mapbox://styles/mapbox/light-v11",
  accessToken: MAPBOX_TOKEN,
  antialias: true,
});

initCollapsibleBehaviour();

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new DimensionToggle({ pitch: 45 }));

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

    // draw walls if in 3d mode, using buffered source (polygon features)
    if (appDimension == Dimensions.THREE_D) {
      setTimeout(drawWalls, 1, map, boundaries_SA1_2016_buffered); // 1 ms delay is required so that the loading spinner appears immediately before drawWalls is called, maybe see if there's a better way to do this
    }
    // draw thicknesses if in 2d mode, using unbuffered source (line features)
    else if (appDimension == Dimensions.TWO_D) {
      // setTimeout(drawThicknesses, 1, map, boundaries_SA1_2016);
      setTimeout(drawWalls, 1, map, boundaries_SA1_2016);
    }

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

  // unbuffered source is used for the 2d walls, since we can add thickness to lines
  let unbufferedSource = {
    type: "geojson",
    data: boundaries_SA1_2016,
  };

  // buffered source is used for the 3d walls, because fill-extrusion only works on polygons, i.e. a buffered source
  let bufferedSource = {
    type: "geojson",
    data: boundaries_SA1_2016_buffered,
  };

  map.addSource("unbufferedSource", unbufferedSource);
  map.addSource("bufferedSource", bufferedSource);

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

function initSources() {}
