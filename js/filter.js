import { Dimensions, LightModes } from "./enums.js";
import { appDimension } from "./index.js";

/**
 * Adds the toggling visibility behaviour that occurs when the corresponding layer checkboxes are clicked by the user
 * @param {*} map mapbox map
 */
export function toggleableLayers(map) {
  // enumerate ids of the layers
  // add id's to this array and add a corresponding checkbox to the HTML file to extend functionality to include other layers
  let toggleableLayerIds = ["boundaries", "walls"];

  for (let id of toggleableLayerIds) {
    let layerCheckbox = document.getElementById(`${id}-checkbox`); // all layer filter checkboxes in the HTML file should be in this form
    layerCheckbox.addEventListener("click", (e) => {
      // if the clicked layer doesn't exist, return
      if (!map.getLayer(id)) {
        console.log("Layer not yet rendered");
        return;
      }

      // if the checkbox is checked, make sure the layer is visible by changing the layout object's visibility property
      if (e.target.checked) {
        map.setLayoutProperty(id, "visibility", "visible");
      }
      // if checkbox is NOT checked, make sure the layer is invisible
      else {
        map.setLayoutProperty(id, "visibility", "none");
      }
    });
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
export function colorCheck(map) {
  let id = "walls";
  let colorCheckbox = document.getElementById(`color-checkbox`); // all layer filter checkboxes in the HTML file should be in this form
  colorCheckbox.addEventListener("click", (e) => {
    // if the clicked layer doesn't exist, return
    if (!map.getLayer(id)) {
      console.log("Layer not yet rendered");
      return;
    }

    // if the checkbox is checked, make sure all wall colours are the same
    if (e.target.checked) {
      let color = "#808080";
      if (appDimension == Dimensions.TWO_D) {
        map.setPaintProperty("walls", "line-color", color);
      } else if (appDimension == Dimensions.THREE_D) {
        map.setPaintProperty("walls", "fill-extrusion-color", color);
      }
    }
    // if checkbox is NOT checked, make sure the wall colours are variable
    else {
      const colors = ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20"];
      let colourExpression = [
        "case",
        [">=", ["to-number", ["get", "womble_scaled"]], 1],
        colors[3],
        [">=", ["to-number", ["get", "womble_scaled"]], 0.6],
        colors[2],
        [">=", ["to-number", ["get", "womble_scaled"]], 0.3],
        colors[1],
        colors[0],
      ];
      if (appDimension == Dimensions.TWO_D) {
        map.setPaintProperty("walls", "line-color", colourExpression);
      } else if (appDimension == Dimensions.THREE_D) {
        map.setPaintProperty("walls", "fill-extrusion-color", colourExpression);
      }
    }
  });
}

export function heightCheck(map) {
  let id = "walls";
  let heightCheckbox = document.getElementById(`height-checkbox`); // all layer filter checkboxes in the HTML file should be in this form
  heightCheckbox.addEventListener("click", (e) => {
    // if the clicked layer doesn't exist, return
    if (!map.getLayer(id)) {
      console.log("Layer not yet rendered");
      return;
    }

    // if the checkbox is checked, set all heights/widths to be the same
    if (e.target.checked) {
      if (appDimension == Dimensions.TWO_D) {
        map.setPaintProperty("walls", "line-width", 4);
      } else if (appDimension == Dimensions.THREE_D) {
        map.setPaintProperty("walls", "fill-extrusion-height", 250);
      }
    }
    // if checkbox is NOT checked, make sure the heights/widths are variable
    else {
      if (appDimension == Dimensions.TWO_D) {
        let lineWidthExpression = [
          "interpolate",
          ["linear"],
          ["zoom"],
          // at zoom lvl 12, the line width range is (1, 4]
          12,
          ["^", 4, ["get", "womble_scaled"]],
          // at zoom lvl 13, the line width range is (1, 8]
          13,
          ["^", 8, ["get", "womble_scaled"]],
          // at zoom lvl 14, the line width range is (1, 12]
          14,
          ["^", 12, ["get", "womble_scaled"]],
          // at zoom lvl 15, the line width range is (1, 16]
          15,
          ["^", 16, ["get", "womble_scaled"]],
          // at zoom lvl 16+, the line width range is (1, 20]
          16,
          ["^", 20, ["get", "womble_scaled"]],
        ];
        map.setPaintProperty("walls", "line-width", lineWidthExpression);
      } else if (appDimension == Dimensions.THREE_D) {
        const HEIGHT_MULTIPLIER = 5000;
        map.setPaintProperty("walls", "fill-extrusion-height", [
          "*",
          ["get", "womble_scaled"],
          HEIGHT_MULTIPLIER,
        ]);
      }
    }
  });
}
