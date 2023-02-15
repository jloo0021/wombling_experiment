import { Dimensions, LightModes } from "./enums.js";
import {
  getColourExpression,
  getConstantWidthExpression,
  getHeightExpression,
  getVariableWidthExpression,
} from "./expressions.js";
import { appDimension } from "./index.js";

export function addInputListeners(map) {
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
  ];

  // add event listeners for each option element
  for (let elemObject of elemObjects) {
    let element = document.getElementById(elemObject.id);
    element.addEventListener(elemObject.event, () => {
      elemObject.handler(map);
    });
  }
}

export function runAllInputHandlers(map) {
  let inputHandlers = [
    boundariesCheckboxHandler,
    wallsCheckboxHandler,
    colourCheckboxHandler,
    heightCheckboxHandler,
    colorAndHeightHandler,
    transparencySliderHandler,
    minMaxSliderHandler,
  ];

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

  // value indicator
  transparencySliderValue.textContent = transparencySlider.value + "%";

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
}

function minMaxSliderHandler(map) {
  // if either slider is adjusted, we have to perform the min max filter

  // elements for the min/max sliders
  let minSlider = document.getElementById("min-slider");
  let minSliderValue = document.getElementById("min-slider-value");
  let maxSlider = document.getElementById("max-slider");
  let maxSliderValue = document.getElementById("max-slider-value");
  let sliderTrack = document.getElementById("min-max-slider-track");

  fillDualSliderColour(minSlider, maxSlider, sliderTrack, 1);

  // automatically adjust slider if user makes min > max
  if (parseFloat(minSlider.value) > parseFloat(maxSlider.value)) {
    console.log("Max must be greater than or equal to min");
    // maxSlider.value = minSlider.value;
    minSlider.value = maxSlider.value;
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

function fillDualSliderColour(slider1, slider2, sliderTrack, maxValue) {
  let percent1 = (slider1.value / maxValue) * 100;
  let percent2 = (slider2.value / maxValue) * 100;
  sliderTrack.style.background = `linear-gradient(to right, #efefef ${percent1}%, #0075ff ${percent1}%, #0075ff ${percent2}%, #efefef ${percent2}%)`;
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
        console.log(map.getStyle());
        let currentStyle = map.getStyle();

        this._mode = LightModes.DARK;
        map.setStyle("mapbox://styles/mapbox/dark-v11");
      }
      // if dark, change to light
      else if (this._mode == LightModes.DARK) {
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
