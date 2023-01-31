import { Dimensions, LightModes } from "./enums.js";
import {
  getColourExpression,
  getHeightExpression,
  getWidthExpression,
} from "./expressions.js";
import { appDimension } from "./index.js";

// // think of this as an abstract class
// class FilterCheckbox {
//   constructor(checkboxElement, map) {
//     this.checkbox = checkboxElement;
//     this.map = map;
//   }
//   isChecked() {
//     return this.checkbox.checked;
//   }

//   // abstract method to be implemented by children
//   runCheckedBehaviour() {}

//   // abstract method to be implemented by children
//   runUncheckedBehaviour() {}

//   handleCheckbox() {
//     if (this.isChecked) {
//       this.runCheckedBehaviour();
//     } else {
//       this.runUncheckedBehaviour();
//     }
//   }
// }

// class BoundariesCheckbox extends FilterCheckbox {}
// class WallsCheckbox extends FilterCheckbox {}
// class ColourCheckbox extends FilterCheckbox {}
// class HeightCheckbox extends FilterCheckbox {}

// TODO: perhaps refactor into something like this for more code reuse:
// let checkboxClasses = [
//   // classes
// ];

// for (let checkboxClass of checkboxClasses) {
//   checkboxClass.handle()
// }

export function addCheckboxListeners(map) {
  let checkboxIds = {
    "boundaries-checkbox": boundariesCheckboxHandler,
    "walls-checkbox": wallsCheckboxHandler,
    "color-checkbox": colourCheckboxHandler,
    "height-checkbox": heightCheckboxHandler,
  };

  // add event listeners for each checkbox
  for (let [checkboxId, handler] of Object.entries(checkboxIds)) {
    let checkbox = document.getElementById(checkboxId);
    checkbox.addEventListener("click", () => {
      handler(map);
    });
  }
}

export function runAllCheckboxHandlers(map) {
  let checkboxHandlers = [
    boundariesCheckboxHandler,
    wallsCheckboxHandler,
    colourCheckboxHandler,
    heightCheckboxHandler,
  ];

  for (let handler of checkboxHandlers) {
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
  }
  // if checkbox is NOT checked, make sure the wall colours are variable
  else {
    let colourExpression = getColourExpression();
    if (appDimension == Dimensions.TWO_D) {
      map.setPaintProperty("walls", "line-color", colourExpression);
    } else if (appDimension == Dimensions.THREE_D) {
      map.setPaintProperty("walls", "fill-extrusion-color", colourExpression);
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
      map.setPaintProperty("walls", "line-width", 4);
    } else if (appDimension == Dimensions.THREE_D) {
      map.setPaintProperty("walls", "fill-extrusion-height", 250);
    }
  }
  // if checkbox is NOT checked, make sure the heights/widths are variable
  else {
    if (appDimension == Dimensions.TWO_D) {
      map.setPaintProperty("walls", "line-width", getWidthExpression());
    } else if (appDimension == Dimensions.THREE_D) {
      map.setPaintProperty(
        "walls",
        "fill-extrusion-height",
        getHeightExpression()
      );
    }
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

// export function colorCheck(map) {
//   let id = "walls";
//   let colorCheckbox = document.getElementById(`color-checkbox`); // all layer filter checkboxes in the HTML file should be in this form
//   colorCheckbox.addEventListener("click", (e) => {
//     // if the clicked layer doesn't exist, return
//     if (!map.getLayer(id)) {
//       console.log("Layer not yet rendered");
//       return;
//     }

//     // if the checkbox is checked, make sure all wall colours are the same
//     if (e.target.checked) {
//       let color = "#808080";
//       if (appDimension == Dimensions.TWO_D) {
//         map.setPaintProperty("walls", "line-color", color);
//       } else if (appDimension == Dimensions.THREE_D) {
//         map.setPaintProperty("walls", "fill-extrusion-color", color);
//       }
//     }
//     // if checkbox is NOT checked, make sure the wall colours are variable
//     else {
//       const colors = ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20"];
//       let colourExpression = [
//         "case",
//         [">=", ["to-number", ["get", "womble_scaled"]], 1],
//         colors[3],
//         [">=", ["to-number", ["get", "womble_scaled"]], 0.6],
//         colors[2],
//         [">=", ["to-number", ["get", "womble_scaled"]], 0.3],
//         colors[1],
//         colors[0],
//       ];
//       if (appDimension == Dimensions.TWO_D) {
//         map.setPaintProperty("walls", "line-color", colourExpression);
//       } else if (appDimension == Dimensions.THREE_D) {
//         map.setPaintProperty("walls", "fill-extrusion-color", colourExpression);
//       }
//     }
//   });
// }

// export function heightCheck(map) {
//   let id = "walls";
//   let heightCheckbox = document.getElementById(`height-checkbox`); // all layer filter checkboxes in the HTML file should be in this form
//   heightCheckbox.addEventListener("click", (e) => {
//     // if the clicked layer doesn't exist, return
//     if (!map.getLayer(id)) {
//       console.log("Layer not yet rendered");
//       return;
//     }

//     // if the checkbox is checked, set all heights/widths to be the same
//     if (e.target.checked) {
//       if (appDimension == Dimensions.TWO_D) {
//         map.setPaintProperty("walls", "line-width", 4);
//       } else if (appDimension == Dimensions.THREE_D) {
//         map.setPaintProperty("walls", "fill-extrusion-height", 250);
//       }
//     }
//     // if checkbox is NOT checked, make sure the heights/widths are variable
//     else {
//       if (appDimension == Dimensions.TWO_D) {
//         let lineWidthExpression = [
//           "interpolate",
//           ["linear"],
//           ["zoom"],
//           // at zoom lvl 12, the line width range is (1, 4]
//           12,
//           ["^", 4, ["get", "womble_scaled"]],
//           // at zoom lvl 13, the line width range is (1, 8]
//           13,
//           ["^", 8, ["get", "womble_scaled"]],
//           // at zoom lvl 14, the line width range is (1, 12]
//           14,
//           ["^", 12, ["get", "womble_scaled"]],
//           // at zoom lvl 15, the line width range is (1, 16]
//           15,
//           ["^", 16, ["get", "womble_scaled"]],
//           // at zoom lvl 16+, the line width range is (1, 20]
//           16,
//           ["^", 20, ["get", "womble_scaled"]],
//         ];
//         map.setPaintProperty("walls", "line-width", lineWidthExpression);
//       } else if (appDimension == Dimensions.THREE_D) {
//         const HEIGHT_MULTIPLIER = 5000;
//         map.setPaintProperty("walls", "fill-extrusion-height", [
//           "*",
//           ["get", "womble_scaled"],
//           HEIGHT_MULTIPLIER,
//         ]);
//       }
//     }
//   });
// }
