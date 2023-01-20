import { retrieveIndicatorSliders } from "./sliders.js";
import { appDimension, indicatorsData } from "./index.js";
import { Dimensions } from "./enums.js";

/**
 * OLD IMPLEMENTATION
 * Draws the heights of the edges based on their womble values.
 * Runs when the user presses the "Run" button after selecting their indicator weights.
 */
// export function drawHeights(map, source) {
//   // TODO: maybe move this function to boundaries.js or just keep it idk

//   // outline:
//   // construct an array that stores edges with their associated womble value as objects
//   // use setPaintProperty on the boundaries layer to set the extrusion heights based on this constructed array
//   // this can be achieved with a 'match' expression
//   // idea drawn from: https://docs.mapbox.com/mapbox-gl-js/example/data-join/

//   const HEIGHT_MULTIPLIER = 5000;
//   let edges = source["features"]; // get all edges from the source into one array
//   let edgeCalculation = []; // output array, where each element is an edge object containing their associated calculated womble value
//   let rawWombleValues = [];
//   let maxWomble = 0; // used to calculate womble_scaled

//   // create array of womble values for each edge
//   for (let edge of edges) {
//     let womble = calculateWomble(edge);
//     rawWombleValues.push(womble);

//     // keep track of the largest womble value
//     if (womble > maxWomble) {
//       maxWomble = womble;
//     }
//   }

//   // handling the case where the max womble is somehow zero, i dont think this should ever happen
//   if (maxWomble == 0) {
//     console.log("Max womble value in this data set is zero");
//     return;
//   }

//   // create our output calculations array
//   for (let i = 0; i < edges.length; i++) {
//     // create the output "row" then add it to our calculations array
//     let edge = edges[i];

//     // TODO: the keys are hardcoded here, what happens if the data is using sa2 id's ? have to think of a more dynamic approach. perhaps we specify that the area id's have to be name area_id1 and area_id2
//     let output = {
//       ogc_fid: edge["properties"]["ogc_fid"],
//       sa1_id1: edge["properties"]["sa1_id1"],
//       sa1_id2: edge["properties"]["sa1_id2"],
//       womble: rawWombleValues[i],
//       womble_scaled: rawWombleValues[i] / maxWomble,
//     };
//     edgeCalculation.push(output);
//   }

//   // console.log(edgeCalculation);
//   // console.log(maxWomble);

//   // building a match expression to get each boundary's womble value, using the ogc_fid as the lookup key
//   let matchExpression = ["match", ["get", "ogc_fid"]];

//   // calculate height of each edge and add to the match expression
//   for (let edge of edgeCalculation) {
//     let height;
//     // if womble value exists for this edge, use it to calculate the edge's height
//     if ("womble_scaled" in edge) {
//       height = edge["womble_scaled"] * HEIGHT_MULTIPLIER;
//     }
//     // else set the height to zero (?)
//     else {
//       height = 0;
//     }

//     matchExpression.push(edge["ogc_fid"], height);
//   }

//   // make the fallback value null or zero? it shouldnt really matter since i think ill code it such that all the ids match
//   matchExpression.push(0);
//   // console.log(matchExpression);

//   // TODO: fix the polygon glitch for this layer, maybe see if there is a way to NOT draw a height for a particular edge
//   if (map.getLayer("walls")) {
//     map.setPaintProperty("walls", "fill-extrusion-height", matchExpression);
//   } else {
//     let wallsLayer = {
//       id: "walls", // this needs to be unique
//       type: "fill-extrusion",
//       source: "boundarySource",
//       paint: {
//         "fill-extrusion-color": "red",
//         "fill-extrusion-opacity": 1,
//         "fill-extrusion-height": matchExpression,
//       },
//     };

//     map.addLayer(wallsLayer);
//   }

//   console.log("Heights drawn");
// }

/**
 * Draws the heights of the edges based on their womble values.
 * Runs when the user presses the "Run" button after selecting their indicator weights.
 * @param {*} map mapbox map object that the walls will be drawn on
 * @param {*} source geojson source for the boundaries upon which walls will be drawn
 */
export function drawWalls(map, source) {
  const HEIGHT_MULTIPLIER = 5000;
  const WIDTH_MULTIPLIER = 10;
  let wallsData = generateWombleFeaturesData(source);

  // if walls have already been drawn (i.e. walls source exists), update the source data with the new data
  if (map.getSource("wallsSource")) {
    map.getSource("wallsSource").setData(wallsData);
  }
  // else, add the walls source and draw the layer for the first time
  else {
    // use the data json object as the source for the walls layer
    let wallsSource = {
      type: "geojson",
      data: wallsData,
    };

    map.addSource("wallsSource", wallsSource);
    console.log(wallsSource);
    console.log(map.getSource("wallsSource"));
    console.log(map.querySourceFeatures("wallsSource"));

    // colors to use for the categories
    const colors = ["#be87b9", "#dcc2dc", "#ebedec", "#b5bcd7"];

    // create and draw the layer
    let wallsLayer;

    // if in 2d mode, draw thicknesses using line
    if (appDimension == Dimensions.TWO_D) {
      wallsLayer = {
        id: "walls",
        type: "line",
        source: "wallsSource",

        layout: {
          "line-join": "miter",
        },

        paint: {
          "line-color": [
            "case",
            [">=", ["to-number", ["get", "womble_scaled"]], 1],
            colors[0],
            [">=", ["to-number", ["get", "womble_scaled"]], 0.6],
            colors[3],
            [">=", ["to-number", ["get", "womble_scaled"]], 0.3],
            colors[2],
            colors[1],
          ],
          "line-opacity": 1,

          // mapbox expression to multiply each feature's womble property with some constant to calculate the width drawn
          "line-width": ["*", ["get", "womble_scaled"], WIDTH_MULTIPLIER],
        },
      };
    }
    // if in 3d mode, draw heights using fill-extrusion
    else if (appDimension == Dimensions.THREE_D) {
      wallsLayer = {
        id: "walls", // this needs to be unique
        type: "fill-extrusion",
        source: "wallsSource",
        paint: {
          "fill-extrusion-color": [
            "case",
            [">=", ["to-number", ["get", "womble_scaled"]], 1],
            colors[0],
            [">=", ["to-number", ["get", "womble_scaled"]], 0.6],
            colors[3],
            [">=", ["to-number", ["get", "womble_scaled"]], 0.3],
            colors[2],
            colors[1],
          ],
          "fill-extrusion-opacity": 1,

          // mapbox expression to multiply each feature's womble property with some constant to calculate the height drawn
          "fill-extrusion-height": [
            "*",
            ["get", "womble_scaled"],
            HEIGHT_MULTIPLIER,
          ],
        },
      };
    }

    map.addLayer(wallsLayer);
  }

  // hide boundaries directly after running womble
  document.getElementById("boundaries-checkbox").checked = false;
  map.setLayoutProperty("boundaries", "visibility", "none");

  // hide loading spinner once the map loads
  document.getElementById("loader").setAttribute("hidden", true);
}

/**
 * Adds thickness to the edges based on their womble values.
 * Runs when the user presses the "Run" button after selecting their indicator weights, while in 2D mode.
 * @param {*} map mapbox map object that the walls will be drawn on
 * @param {*} source geojson source for the boundaries upon which walls will be drawn
 */
// export function drawThicknesses(map, source) {
//   console.log("drawing thicknesses");
//   const WIDTH_MULTIPLIER = 10;
//   let thicknessesData = generateWombleFeaturesData(source);

//   // if thicknesses have already been drawn (i.e. thicknesses source exists), update the source data with the new data
//   if (map.getSource("thicknessesSource")) {
//     map.getSource("thicknessesSource").setData(thicknessesData);
//   }
//   // else, add the thicknesses source and draw the layer for the first time
//   else {
//     // use the data json object as the source for the thicknesses layer
//     let thicknessesSource = {
//       type: "geojson",
//       data: thicknessesData,
//     };

//     console.log(thicknessesSource);

//     map.addSource("thicknessesSource", thicknessesSource);

//     // colors to use for the categories
//     const colors = ["#be87b9", "#dcc2dc", "#ebedec", "#b5bcd7"];

//     // create and draw the layer
//     let thicknessesLayer = {
//       id: "thicknesses", // this needs to be unique
//       type: "line",
//       source: "thicknessesSource",

//       layout: {
//         "line-join": "miter",
//         "line-miter-limit": 0,
//       },
//       paint: {
//         "line-color": [
//           "case",
//           [">=", ["to-number", ["get", "womble_scaled"]], 1],
//           colors[0],
//           [">=", ["to-number", ["get", "womble_scaled"]], 0.6],
//           colors[3],
//           [">=", ["to-number", ["get", "womble_scaled"]], 0.3],
//           colors[2],
//           colors[1],
//         ],
//         "line-opacity": 1,

//         // mapbox expression to multiply each feature's womble property with some constant to calculate the width drawn
//         "line-width": ["*", ["get", "womble_scaled"], WIDTH_MULTIPLIER],
//       },
//     };

//     map.addLayer(thicknessesLayer);
//   }

//   // hide boundaries directly after running womble
//   document.getElementById("boundaries-checkbox").checked = false;
//   map.setLayoutProperty("boundaries", "visibility", "none");

//   // hide loading spinner once the map loads
//   document.getElementById("loader").setAttribute("hidden", true);
// }

/**
 * Creates womble data which can be used to draw features on a mapbox map.
 * Womble data will be created for each edge in the supplied source data.
 * This womble data is added as a property for each edge, but this is done so as a deep copy so as not to modify the supplied source data.
 * @param {*} source geojson source for the boundaries upon which the womble features will be drawn
 * @returns data in json form that can be supplied as the data property in a mapbox source
 */
function generateWombleFeaturesData(source) {
  let edges = source["features"]; // get all edges from the source into one array
  let rawWombleValues = [];
  let maxWomble = 0; // used to calculate womble_scaled

  // create array of womble values for each edge
  for (let edge of edges) {
    let womble = calculateWomble(edge);
    rawWombleValues.push(womble);

    // keep track of the largest womble value
    if (womble > maxWomble) {
      maxWomble = womble;
    }
  }

  // handling the case where the max womble is somehow zero, i dont think this should ever happen
  if (maxWomble == 0) {
    console.log("Max womble value in this data set is zero");
    document.getElementById("loader").setAttribute("hidden", true);
    return;
  }

  // create a new geojson that will be used for the womble features source data
  let wombleFeaturesData = {
    type: "FeatureCollection",
    features: [],
  };

  // add each edge that has a non-zero womble value to the walls source data
  for (let i = 0; i < edges.length; i++) {
    let edge = JSON.parse(JSON.stringify(edges[i])); // deep copying the edge so the original source is not modified
    if (rawWombleValues[i] > 0) {
      edge["properties"]["womble"] = rawWombleValues[i];
      edge["properties"]["womble_scaled"] = rawWombleValues[i] / maxWomble;
      wombleFeaturesData.features.push(edge);
    }
  }

  return wombleFeaturesData;
}

/**
 * Calculates the womble value for a particular edge
 * @param {Number} edge object corresponding to the edge that the womble calculation is being done for
 * @returns {Number} womble value
 */
function calculateWomble(edge) {
  // TODO: pass in the indicators csv as an array? or some type of object i can use
  // console.log(indicatorsData);

  let sliders = retrieveIndicatorSliders();

  // retrieve the user's selected indicator names and weights
  let selectedIndicators = [];
  let indicatorWeights = [];
  for (let slider of sliders) {
    selectedIndicators.push(slider.getAttribute("indicatorname")); // each slider was previously created with an "indicatorname" attribute
    indicatorWeights.push(parseFloat(slider.value));
  }

  let womble = 0;

  // find the elements in the indicators csv array that corresponds to the edges neighbouring areas
  let area1 = indicatorsData.find(
    (area) => area["sa1"] == edge["properties"]["sa1_id1"] // TODO: will have to update area code name, hardcoded to sa1_id1 for now
  );

  let area2 = indicatorsData.find(
    (area) => area["sa1"] == edge["properties"]["sa1_id2"] // TODO: will have to update area code name, hardcoded to sa1_id2 for now
  );

  // if either or both of the areas are undefined it means the indicators csv doesn't have data for that area and therefore we cannot calculate a womble value for that edge
  if (area1 == undefined || area2 == undefined) {
    console.log(`Indicators data not found for this edge`);
    return 0; // TODO: could return null instead, and if womble is null, draw the edge in a different way?
  }

  // actual womble calculation is done here
  for (let i = 0; i < selectedIndicators.length; i++) {
    // if an indicator value is found to not be a number, we can't calculate womble, communicate it to user. TODO: for now it prints to console, but we should print it to somewhere on the page
    if (
      isNaN(area1[selectedIndicators[i]]) ||
      isNaN(area2[selectedIndicators[i]])
    ) {
      console.log(
        `Warning: Indicator value is not a number. Found: ${
          area1[selectedIndicators[i]]
        } and ${area2[selectedIndicators[i]]}`
      );
      return 0;
    }

    // womble += indicatorWeights[i] * absolute difference of (area1's selectedIndicator[i] value and area2's selectedIndicator[i] value)
    womble +=
      indicatorWeights[i] *
      Math.abs(
        parseFloat(area1[selectedIndicators[i]]) -
          parseFloat(area2[selectedIndicators[i]])
      );
  }

  return womble;
}

// TODO: use this function to decide whether or not to use distance weighting once i figure out the specifics of how to implement
/**
 * Function that checks whether the user has chosen to use distance weighting
 */
function isDistanceWeighted() {
  let checkbox = document.getElementById("distance-weight-checkbox");
  return checkbox.checked;
}
