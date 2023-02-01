import { createIndicatorSliders, setDefaultWeights } from "./sliders.js";
import { createVariables, getSelectValues } from "./variableOptions.js";
import {
  initClickableAreaBehaviour,
  initClickableWallBehaviour,
  initMapAreas,
  initMapBoundaries,
} from "./boundaries.js";
import { drawWalls, DimensionToggle } from "./womble.js";
// import geoJsonData from "../liveability_sa1_2011_difference_buffered_transformed.geojson" assert { type: "json" };
// import boundaries_SA1_2011 from "../boundaries_SA1_2011_wgs84_buffered.geojson" assert { type: "json" };
import boundaries_SA1_2016_buffered from "../boundaries_SA1_2016_wgs84_buffered7.geojson" assert { type: "json" };
import boundaries_SA1_2016 from "../boundaries_SA1_2016_wgs84.geojson" assert { type: "json" };
import {
  addCheckboxListeners,
  darkModeToggle,
  // toggleableLayers,
  // colorCheck,
  // heightCheck,
} from "./filter.js";
// import geoJsonData from "../liveability_sa1_2011_difference_buffered_transformed.geojson" assert { type: "json" };
// import boundaries_SA1_2011 from "../boundaries_SA1_2011_wgs84_buffered.geojson" assert { type: "json" };
import {
  createIndicatorOptions,
  removeIndicatorOptions,
  getValues,
} from "./indicatorOptions.js";
import areas_SA1_2016 from "../SA1_2016_Greater_Melbourne.geojson" assert { type: "json" };
import { initCollapsibleBehaviour } from "./collapsible.js";
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
export let csvAreaCode;
export function setIndicatorsData(data) {
  indicatorsData = data.data;
  let headers = Object.keys(data.data[0]);
  csvAreaCode = headers.shift();
  optionsData = headers;

  createVariables(headers);
}

// export function setIndicatorsData(data) {
//   indicatorsData = data[0];
//   csvAreaCode = data[1].shift();
//   optionsData = data[1];

//   createIndicatorOptions(optionsData);
//   new MultiSelectTag("indicators-selection"); // id
//   document.getElementById("selectionBlock").classList.remove("hide");
// }

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
  zoom: 12,
  minZoom: 12,
  maxPitch: 0,
  style: "mapbox://styles/mapbox/light-v11",
  accessToken: MAPBOX_TOKEN,
  antialias: true,
});

initCollapsibleBehaviour();

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new DimensionToggle({ pitch: 45 }));
// map.addControl(new darkModeToggle());

let selectionSubmit = document.getElementById("submitOptions");
selectionSubmit.addEventListener("click", () => submitOptions());
function submitOptions() {
  let selectedValues = getSelectValues(optionsData);
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
      // TODO: loading spinner is broken sometimes?
      setTimeout(drawWalls, 1, map, boundaries_SA1_2016_buffered); // 1 ms delay is required so that the loading spinner appears immediately before drawWalls is called, maybe see if there's a better way to do this
    }
    // draw thicknesses if in 2d mode, using unbuffered source (line features)
    else if (appDimension == Dimensions.TWO_D) {
      setTimeout(drawWalls, 1, map, boundaries_SA1_2016);
    }

    // drawWalls(map, boundaries_SA1_2016);
  } else {
    console.log("Indicators data not found");
  }
});

// Legend logic
// create legend
const legend = document.getElementById('legend');
const colors = ["#fed976", "#fd8d3c", "#fc4e2a", "#e31a1c"];
const womble_scaled_breaks = [0, 0.3, 0.6, 1];

const item = document.createElement('div');
const value = document.createElement('span');
value.innerHTML = "<b>Wombled Scaled Values</b>";
item.appendChild(value);
legend.appendChild(item);

for (let i = 0; i < colors.length-1; i++) {
  const color = colors[i];
  const item = document.createElement('div');

  const key = document.createElement('span');
  key.className = 'legend-key';
  key.style.backgroundColor = color;

  const value = document.createElement('span');
  value.innerHTML = womble_scaled_breaks[i] + " - " + womble_scaled_breaks[i+1];

  item.appendChild(key);
  item.appendChild(value);
  legend.appendChild(item);
} 
  



// when map loads, do...
map.on("load", () => {
  initMapBoundaries(map, areas_SA1_2016);
  initMapAreas(map, areas_SA1_2016);
  initClickableWallBehaviour(map);
  initClickableAreaBehaviour(map);

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

  // toggleableLayers(map);
  // colorCheck(map);
  // heightCheck(map);
  addCheckboxListeners(map);

  transparencySlider.addEventListener("input", (e) => {
    if (!map.getLayer("walls")) {
      console.log("Layer doesn't exist");
      return;
    }

    // adjust the boundary layer's fill-extrusion-opacity value. If you change the id of the boundary layer you'll also have to change it here
    if (appDimension == Dimensions.TWO_D) {
      map.setPaintProperty(
        "walls",
        "line-opacity",
        parseInt(e.target.value, 10) / 100
      );
    } else if (appDimension == Dimensions.THREE_D) {
      map.setPaintProperty(
        "walls",
        "fill-extrusion-opacity",
        parseInt(e.target.value, 10) / 100
      );
    }

    // value indicator
    transparencySliderValue.textContent = e.target.value + "%";
  });
});

// document.getElementById("test").addEventListener("click", () => {
//   appendIndicatorsToAreas(map.getSource("areasSource"));
//   console.log(map.getSource("areasSource"));
// });
