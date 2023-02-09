import { Dimensions, LightModes } from "./enums.js";
import {
  getColourExpression,
  getConstantWidthExpression,
  getHeightExpression,
  getVariableWidthExpression,
} from "./expressions.js";
import {
  appDimension,
  beforeMap,
  compareMap,
  previousWombleData,
  setBeforeMap,
  setCompareMap,
  setDimension,
} from "./index.js";
import { addWallsLayer } from "./womble.js";

/**
 * Adds event listeners for all view option inputs.
 * @param {*} map the mapbox map object that will be affected by the view option inputs
 * @param {*} options set before to true if map is the "before" map. The "before" map will not have the showPreviousHandler added to it
 */
export function addInputListeners(map, options = { before: false }) {
  // each element in this array corresponds to some sort of option that the user has
  // the object describes the html id of the input element, the function that handles the input, and the event to trigger the input handler
  let elemObjects = [
    {
      id: "boundaries-checkbox",
      handler: boundariesCheckboxHandler,
      event: "click",
    },
    { id: "walls-checkbox", handler: wallsCheckboxHandler, event: "click" },
    { id: "color-checkbox", handler: colourCheckboxHandler, event: "click" },
    { id: "height-checkbox", handler: heightCheckboxHandler, event: "click" },
    { id: "both-checkbox", handler: colorAndHeightHandler, event: "click" },
    {
      id: "transparency-slider",
      handler: transparencySliderHandler,
      event: "input",
    },
    { id: "min-slider", handler: minMaxSliderHandler, event: "input" },
    { id: "max-slider", handler: minMaxSliderHandler, event: "input" },
    { id: "previous-checkbox", handler: showPreviousHandler, event: "click" },
  ];

  // if before flag is set to true, we don't want to add the compare previous handler
  if (options.before) {
    elemObjects = elemObjects.filter((obj) => obj.id != "previous-checkbox");
  }

  // add event listeners for each option element
  for (let elemObject of elemObjects) {
    let element = document.getElementById(elemObject.id);
    element.addEventListener(elemObject.event, () => {
      elemObject.handler(map);
    });
  }
}

export function runAllInputHandlers(map, options = { before: false }) {
  let inputHandlers = [
    boundariesCheckboxHandler,
    wallsCheckboxHandler,
    colourCheckboxHandler,
    heightCheckboxHandler,
    colorAndHeightHandler,
    transparencySliderHandler,
    minMaxSliderHandler,
  ];

  // if before flag is set to true, we don't want to run the compare previous handler
  if (!options.before) {
    inputHandlers.push(showPreviousHandler);
  }

  for (let handler of inputHandlers) {
    handler(map);
  }
}

function boundariesCheckboxHandler(map) {
  // if the clicked layer doesn't exist, return
  if (!map.getLayer("boundaries")) {
    console.log("Layer not yet rendered");
    return;
  }

  let checkbox = document.getElementById("boundaries-checkbox");
  // if the checkbox is checked, make sure the layer is visible by changing the layout object's visibility property
  if (checkbox.checked) {
    map.setLayoutProperty("boundaries", "visibility", "visible");
  }
  // if checkbox is NOT checked, make sure the layer is invisible
  else {
    map.setLayoutProperty("boundaries", "visibility", "none");
  }
}

function wallsCheckboxHandler(map) {
  // if the clicked layer doesn't exist, return
  if (!map.getLayer("walls")) {
    console.log("Layer not yet rendered");
    return;
  }

  let checkbox = document.getElementById("walls-checkbox");
  // if the checkbox is checked, make sure the layer is visible by changing the layout object's visibility property
  if (checkbox.checked) {
    map.setLayoutProperty("walls", "visibility", "visible");
  }
  // if checkbox is NOT checked, make sure the layer is invisible
  else {
    map.setLayoutProperty("walls", "visibility", "none");
  }
}

function colourCheckboxHandler(map) {
  let id = "walls";
  let checkbox = document.getElementById(`color-checkbox`);

  if (!map.getLayer(id)) {
    console.log("Layer not yet rendered");
    return;
  }

  // if the checkbox is checked, make sure all wall colours are the same
  if (checkbox.checked) {
    let color = "#808080";
    if (appDimension == Dimensions.TWO_D) {
      map.setPaintProperty("walls", "line-color", color);
    } else if (appDimension == Dimensions.THREE_D) {
      map.setPaintProperty("walls", "fill-extrusion-color", color);
    }

    if (appDimension == Dimensions.TWO_D) {
      map.setPaintProperty("walls", "line-width", getVariableWidthExpression());
    } else if (appDimension == Dimensions.THREE_D) {
      map.setPaintProperty(
        "walls",
        "fill-extrusion-height",
        getHeightExpression()
      );
    }
  }
}

function heightCheckboxHandler(map) {
  let id = "walls";
  let checkbox = document.getElementById(`height-checkbox`);
  // if the clicked layer doesn't exist, return
  if (!map.getLayer(id)) {
    console.log("Layer not yet rendered");
    return;
  }

  // if the checkbox is checked, set all heights/widths to be the same
  if (checkbox.checked) {
    if (appDimension == Dimensions.TWO_D) {
      map.setPaintProperty("walls", "line-width", getConstantWidthExpression());
    } else if (appDimension == Dimensions.THREE_D) {
      map.setPaintProperty("walls", "fill-extrusion-height", 250);
    }

    let colourExpression = getColourExpression();
    if (appDimension == Dimensions.TWO_D) {
      map.setPaintProperty("walls", "line-color", colourExpression);
    } else if (appDimension == Dimensions.THREE_D) {
      map.setPaintProperty("walls", "fill-extrusion-color", colourExpression);
    }
  }

  // // if checkbox is NOT checked, make sure the heights/widths are variable
  // else {
  //   if (appDimension == Dimensions.TWO_D) {
  //     map.setPaintProperty("walls", "line-width", getWidthExpression());
  //   } else if (appDimension == Dimensions.THREE_D) {
  //     map.setPaintProperty(
  //       "walls",
  //       "fill-extrusion-height",
  //       getHeightExpression()
  //     );
  //   }
  // }
}

function colorAndHeightHandler(map) {
  let id = "walls";
  let checkbox = document.getElementById(`both-checkbox`);
  // if the clicked layer doesn't exist, return
  if (!map.getLayer(id)) {
    console.log("Layer not yet rendered");
    return;
  }

  // if the checkbox is checked, set all heights/widths to be variable and apply colour
  if (checkbox.checked) {
    if (appDimension == Dimensions.TWO_D) {
      map.setPaintProperty("walls", "line-width", getVariableWidthExpression());
    } else if (appDimension == Dimensions.THREE_D) {
      map.setPaintProperty(
        "walls",
        "fill-extrusion-height",
        getHeightExpression()
      );
    }

    let colourExpression = getColourExpression();
    if (appDimension == Dimensions.TWO_D) {
      map.setPaintProperty("walls", "line-color", colourExpression);
    } else if (appDimension == Dimensions.THREE_D) {
      map.setPaintProperty("walls", "fill-extrusion-color", colourExpression);
    }
  }
}

function transparencySliderHandler(map) {
  // elements for the transparency slider
  let transparencySlider = document.getElementById("transparency-slider");
  let transparencySliderValue = document.getElementById(
    "transparency-slider-value"
  );

  if (!map.getLayer("walls")) {
    console.log("Layer doesn't exist");
    return;
  }

  // adjust the boundary layer's fill-extrusion-opacity value. If you change the id of the boundary layer you'll also have to change it here
  if (appDimension == Dimensions.TWO_D) {
    map.setPaintProperty(
      "walls",
      "line-opacity",
      parseInt(transparencySlider.value, 10) / 100
    );
  } else if (appDimension == Dimensions.THREE_D) {
    map.setPaintProperty(
      "walls",
      "fill-extrusion-opacity",
      parseInt(transparencySlider.value, 10) / 100
    );
  }

  // value indicator
  transparencySliderValue.textContent = transparencySlider.value + "%";
}

function minMaxSliderHandler(map) {
  // if either slider is adjusted, we have to perform the min max filter

  // elements for the min/max sliders
  let minSlider = document.getElementById("min-slider");
  let minSliderValue = document.getElementById("min-slider-value");
  let maxSlider = document.getElementById("max-slider");
  let maxSliderValue = document.getElementById("max-slider-value");

  // automatically adjust slider if user makes min > max
  if (parseFloat(minSlider.value) > parseFloat(maxSlider.value)) {
    console.log("Max must be greater than or equal to min");
    maxSlider.value = minSlider.value;
    // minSlider.value = maxSlider.value;
  }

  let min = parseFloat(minSlider.value);
  let max = parseFloat(maxSlider.value);

  // update display values
  minSliderValue.textContent = min;
  maxSliderValue.textContent = max;

  if (!map.getLayer("walls")) {
    console.log("No walls to filter yet");
    return;
  }

  // filter the walls layer

  // returns true if wall's womble_scaled is >= min slider value
  let greaterThanMinExpression = [">=", ["get", "womble_scaled"], min];

  // returns true if wall's womble_scaled is <= max slider value
  let lessThanMaxExpression = ["<=", ["get", "womble_scaled"], max];

  // returns true if wall's womble_scaled is in the range [min, max]
  let filterExpression = [
    "all",
    greaterThanMinExpression,
    lessThanMaxExpression,
  ];

  map.setFilter("walls", filterExpression);
}

// this function should only be called on the "current" map and not the "before" map
function showPreviousHandler(map) {
  let checkbox = document.getElementById("previous-checkbox");

  if (checkbox.checked) {
    // check if previous womble exists
    // previousWombleData is a global var
    if (previousWombleData === null) {
      console.log("No previous womble data exists");
      return;
    }

    // remove existing compare object
    if (compareMap !== null) {
      compareMap.remove();
      setCompareMap(null);
    }

    // remove existing "before" map div
    if (document.getElementById("before-map")) {
      document.getElementById("before-map").remove();
    }

    setBeforeMap(null);

    // create "before" map div and insert into "comparison-container" div
    let beforeMapDiv = document.createElement("div");
    beforeMapDiv.id = "before-map";
    beforeMapDiv.classList.add("map");
    document
      .getElementById("comparison-container")
      .insertBefore(beforeMapDiv, document.getElementById("current-map"));

    // create "before" map object
    // basically copy the exact style and init all the required behaviours
    const MAPBOX_TOKEN =
      "pk.eyJ1IjoibmR1bzAwMDMiLCJhIjoiY2tnNHlucmF3MHA4djJ6czNkaHRycmo1OCJ9.xfU4SWH35W5BYtJP8VnTEA";

    let { lng, lat } = map.getCenter();
    let beforeMap = new mapboxgl.Map({
      container: "before-map",
      center: [lng, lat],
      zoom: map.getZoom(),
      minZoom: map.getMinZoom(),
      pitch: map.getPitch(),
      maxPitch: map.getMaxPitch(),
      bearing: map.getBearing(),
      style: map.getStyle(),
      accessToken: MAPBOX_TOKEN,
    });

    beforeMap.on("load", () => {
      // set before map's data to previous womble data
      beforeMap.getSource("wallsSource").setData(previousWombleData);

      // init view option handlers, EXCEPT for showPreviousHandler, as it's written only for the "current" map
      // therefore we set the before option to true
      addInputListeners(beforeMap, { before: true });

      // create comparison
      setCompareMap(
        new mapboxgl.Compare(beforeMap, map, "#comparison-container")
      );

      setBeforeMap(beforeMap);
    });
  } else {
    // get compare object and delete it
    if (compareMap !== null) {
      compareMap.remove();
      setCompareMap(null);
    }

    // delete "before" map div
    if (document.getElementById("before-map")) {
      document.getElementById("before-map").remove();
    }

    setBeforeMap(null);
  }
}

/**
 * Control button for switching between 2D and 3D modes.
 * If pressed while in 2D mode, any existing walls are converted to fill-extrusion polygons, and pitch is added to the map.
 * If pressed while in 3D mode, any existing walls are converted to flat lines, and altering the map pitch is disabled.
 */
export class DimensionToggle {
  constructor({ pitch = 45 }) {
    this._previousPitch = pitch;
    // TODO: take in before and current maps as parameter?
    // so that we can switch to 2d/3d for both maps at once
  }

  // should only be added to "current" map, not "before" map
  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this._btn = document.createElement("button");

    // style the dimension toggle button depending on what dimension the app is in (i.e. if app is in 2d mode, show 3d on button)
    if (appDimension == Dimensions.TWO_D) {
      this._btn.className = `mapboxgl-ctrl-icon mapboxgl-ctrl-dimensiontoggle-3d`;
    } else if (appDimension == Dimensions.THREE_D) {
      this._btn.className = `mapboxgl-ctrl-icon mapboxgl-ctrl-dimensiontoggle-2d`;
    }

    // switch dimensions when this button is clicked
    this._btn.addEventListener("click", () => {
      if (appDimension == Dimensions.TWO_D) {
        this.#switchTo3d(map);
        // beforeMap is global
        if (beforeMap !== null) {
          this.#switchTo3d(beforeMap, { before: true });
        }
      } else if (appDimension == Dimensions.THREE_D) {
        this.#switchTo2d(map);
        if (beforeMap !== null) {
          this.#switchTo2d(beforeMap, { before: true });
        }
      }
    });

    this._container.appendChild(this._btn);
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }

  #convertWalls(map, options = { before: false }) {
    if (!map.getSource("wallsSource")) {
      console.log("No existing walls to convert");
      return;
    }

    let wallsData = map.getSource("wallsSource")._data;

    // will use either unbuffered or buffered features
    // unbuffered features if we're converting to 2d b/c we want lines
    // buffered features if we're converting to 3d b/c we want polygons that we can make fill-extrusions from
    let rawFeatures;
    if (appDimension == Dimensions.TWO_D) {
      rawFeatures = map.getSource("unbufferedSource")._data["features"];
    } else if (appDimension == Dimensions.THREE_D) {
      rawFeatures = map.getSource("bufferedSource")._data["features"];
    }

    // overwrite the geometries for each feature in the existing walls data
    for (let wall of wallsData["features"]) {
      // the raw source data will have more features than the existing walls data, b/c the walls data will have filtered out edges where the womble cannot be calculated
      // therefore, we need to "find" the features in the raw source that correspond with our existing walls
      let rawFeature = rawFeatures.find(
        (feature) =>
          feature["properties"]["ogc_fid"] == wall["properties"]["ogc_fid"]
      );

      rawFeature = JSON.parse(JSON.stringify(rawFeature)); // deep copy so we don't somehow modify raw source
      wall["geometry"] = rawFeature["geometry"];
    }

    map.removeLayer("walls");
    map.getSource("wallsSource").setData(wallsData);
    addWallsLayer(map);
    runAllInputHandlers(map, { before: options.before });
  }

  #switchTo3d(map, options = { before: false }) {
    // switch to 3d
    setDimension(Dimensions.THREE_D);
    this._btn.className = `mapboxgl-ctrl-icon mapboxgl-ctrl-dimensiontoggle-2d`;

    // restore previous pitch
    map.easeTo({
      pitch: this._previousPitch,
      duration: 1000,
    });
    map.setMaxPitch(85); // default max pitch

    // set min zoom
    map.setMinZoom(9);

    // delete thicknesses and draw walls
    this.#convertWalls(map, options);

    // Change the radio label to height only
    document.getElementById("colorOnly-label").innerText = "Height only";
    document.getElementById("both-check-label").innerText =
      "Both Color and Height";
  }

  #switchTo2d(map, options = { before: false }) {
    // switch to 2d
    setDimension(Dimensions.TWO_D);
    this._btn.className = `mapboxgl-ctrl-icon mapboxgl-ctrl-dimensiontoggle-3d`;

    // disable pitch
    this._previousPitch = map.getPitch();
    map.easeTo({ pitch: 0, duration: 1000 });
    map.setMaxPitch(0);

    // set min zoom
    map.setMinZoom(9);

    // delete walls and draw thicknesses
    this.#convertWalls(map, options);

    // Change the radio label to width only
    document.getElementById("colorOnly-label").innerText = "Width only";
    document.getElementById("both-check-label").innerText =
      "Both Color and Width";
  }
}

// TODO: move control buttons into one file together?
// ALSO, changing the style just doesn't work, b/c it deletes all existing layers and sources
export class darkModeToggle {
  constructor(mode = LightModes.LIGHT) {
    this._mode = mode;
  }
  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this._btn = document.createElement("button");

    this._btn.addEventListener("click", () => {
      // if light, change to dark
      if (this._mode == LightModes.LIGHT) {
        // this doesnt work
        console.log(map.getStyle());
        let currentStyle = map.getStyle();
        currentStyle.sprite = "mapbox://sprites/mapbox/dark-v11";

        this._mode = LightModes.DARK;
        map.setStyle(currentStyle);
      }
      // if dark, change to light
      else if (this._mode == LightModes.DARK) {
        console.log(map.getStyle());
        this._mode = LightModes.LIGHT;
        map.setStyle("mapbox://styles/mapbox/light-v11");
      }
    });

    this._container.appendChild(this._btn);
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
