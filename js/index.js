import { createIndicatorSliders, setDefaultWeights } from "./sliders.js";
import { createVariables, getSelectValues } from "./variableOptions.js";
import {
  closeExistingPopups,
  initClickableAreaBehaviour,
  initClickableWallBehaviour,
  initMapAreas,
  initMapBoundaries,
} from "./boundaries.js";
import { runWomble, DimensionToggle } from "./womble.js";
import boundaries_SA1_2011_buffered from "../boundaries_SA1_2011_dist_wgs84_buffered7.geojson" assert { type: "json" };
import boundaries_SA1_2011 from "../boundaries_SA1_2011_dist_wgs84.geojson" assert { type: "json" };
import areas_SA1_2011 from "../SA1_2011_Greater_Melbourne.geojson" assert { type: "json" };
import boundaries_SA1_2016_buffered from "../boundaries_SA1_2016_wgs84_buffered7.geojson" assert { type: "json" };
import boundaries_SA1_2016 from "../boundaries_SA1_2016_wgs84.geojson" assert { type: "json" };
import areas_SA1_2016 from "../SA1_2016_Greater_Melbourne.geojson" assert { type: "json" };
import { addInputListeners } from "./filter.js";
// import geoJsonData from "../liveability_sa1_2011_difference_buffered_transformed.geojson" assert { type: "json" };
// import boundaries_SA1_2011 from "../boundaries_SA1_2011_wgs84_buffered.geojson" assert { type: "json" };
import {
  createIndicatorOptions,
  removeIndicatorOptions,
  getValues,
} from "./indicatorOptions.js";

import { initCollapsibleBehaviour } from "./collapsible.js";
import { Dimensions } from "./enums.js";
import { addStyleListeners } from "./styleOptions.js";
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

export let geojsonAreaCode;
export function setGeojsonAreaCode(areaCode) {
  geojsonAreaCode = areaCode;
}
export function getGeojsonAreaCode() {
  return geojsonAreaCode;
}

// stores the user's selected variables for running the womble calc
export let selectedVariables;
export function setSelectedVariables(variables) {
  selectedVariables = variables;
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

let map = new mapboxgl.Map({
  container: "map",
  center: [144.9628, -37.8102], // long lat of melb
  // center: [145.2, -37.8102], // long lat of east side melb
  // center: [149.8911094722651, -35.0898882056091],
  zoom: 9,
  minZoom: 9,
  maxPitch: 0,
  style: "mapbox://styles/mapbox/light-v11",
  accessToken: MAPBOX_TOKEN,
  antialias: true,
});

initCollapsibleBehaviour();

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new DimensionToggle({ pitch: 45 }));
// map.addControl(new darkModeToggle());

// let selectionSubmit = document.getElementById("submitOptions");
// selectionSubmit.addEventListener("click", () => submitOptions());
// function submitOptions() {
//   let selectedValues = getSelectValues(optionsData);
//   createIndicatorSliders(selectedValues);
// }

// add event listener to the button for resetting indicator weight sliders
let resetWeightsButton = document.getElementById("reset-weights-button");
resetWeightsButton.addEventListener("click", setDefaultWeights);

// Legend logic
// create legend
const legend = document.getElementById("legend");
const colors = ["#fed976", "#fd8d3c", "#fc4e2a", "#e31a1c"];
const womble_scaled_breaks = [0, 0.25, 0.5, 0.75, 1];

const item = document.createElement("div");
const value = document.createElement("span");
value.innerHTML = "<b>Wombled Scaled Values</b>";
item.appendChild(value);
legend.appendChild(item);

for (let i = 0; i < colors.length; i++) {
  const color = colors[i];
  const item = document.createElement("div");

  const key = document.createElement("span");
  key.className = "legend-key";
  key.style.backgroundColor = color;

  const value = document.createElement("span");
  value.innerHTML =
    womble_scaled_breaks[i] + " - " + womble_scaled_breaks[i + 1];

  item.appendChild(key);
  item.appendChild(value);
  legend.appendChild(item);
}

// when map loads, do...
map.on("load", () => {
  document.getElementById("areasSelect").addEventListener("change", () => {
    areaDropDownHandler(map);
  });
  areaDropDownHandler(map);

  initClickableWallBehaviour(map);
  initClickableAreaBehaviour(map);

  addInputListeners(map);
  addStyleListeners(map);
});

// document.getElementById("test").addEventListener("click", () => {
//   console.log(map.getStyle());
// });

export function areaDropDownHandler(map) {
  let areaTypes = {
    sa1_2011: {
      unbuffered: boundaries_SA1_2011,
      buffered: boundaries_SA1_2011_buffered,
      areas: areas_SA1_2011,
      areaCodeProp: "SA1_7DIG11", // idk why but the boundaries file im using uses the 7 digit codes
    },
    sa1_2016: {
      unbuffered: boundaries_SA1_2016,
      buffered: boundaries_SA1_2016_buffered,
      areas: areas_SA1_2016,
      areaCodeProp: "SA1_MAIN16",
    },
  };
  let selection = document.getElementById("areasSelect").value;
  let selectedUnbuffered = areaTypes[selection].unbuffered;
  let selectedBuffered = areaTypes[selection].buffered;
  let selectedAreas = areaTypes[selection].areas;
  let selectedAreaCodeProp = areaTypes[selection].areaCodeProp;
  setGeojsonAreaCode(selectedAreaCodeProp);

  // re-init map boundaries
  initMapBoundaries(map, selectedAreas);
  initMapAreas(map, selectedAreas);

  // re-init unbuffered and buffered sources
  if (map.getSource("wallsSource")) {
    map.removeLayer("walls");
    map.removeSource("wallsSource");
  }

  if (map.getSource("unbufferedSource")) {
    map.getSource("unbufferedSource").setData(selectedUnbuffered);
  } else {
    let unbufferedSource = {
      type: "geojson",
      data: selectedUnbuffered,
    };
    map.addSource("unbufferedSource", unbufferedSource);
  }

  if (map.getSource("bufferedSource")) {
    map.getSource("bufferedSource").setData(selectedBuffered);
  } else {
    let bufferedSource = {
      type: "geojson",
      data: selectedBuffered,
    };
    map.addSource("bufferedSource", bufferedSource);
  }

  // button for drawing the edge heights based on womble calculation
  let runWombleButton = document.getElementById("run-womble-button");

  // clone the button to remove existing listeners
  let newRunWombleButton = runWombleButton.cloneNode(true);
  runWombleButton.parentNode.replaceChild(newRunWombleButton, runWombleButton);

  newRunWombleButton.addEventListener("click", () => {
    if (indicatorsData) {
      document.getElementById("loader").removeAttribute("hidden"); // show loading spinner

      // draw walls if in 3d mode, using buffered source (polygon features)
      if (appDimension == Dimensions.THREE_D) {
        // TODO: loading spinner is broken sometimes?
        setTimeout(runWomble, 1, map, selectedBuffered); // 1 ms delay is required so that the loading spinner appears immediately before drawWalls is called, maybe see if there's a better way to do this
      }
      // draw thicknesses if in 2d mode, using unbuffered source (line features)
      else if (appDimension == Dimensions.TWO_D) {
        setTimeout(runWomble, 1, map, selectedUnbuffered);
      }

      // drawWalls(map, boundaries_SA1_2016);
    } else {
      console.log("Indicators data not found");
    }
  });

  closeExistingPopups(map);

  document.getElementById("boundaries-checkbox").checked = true;
}
