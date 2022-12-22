import { retrieveIndicatorSliders } from "./sliders.js";
import indicatorsData from "../liveability_indicators_sa1_2016.json" assert { type: "json" };

/**
 * Draws the heights of the edges based on their womble values.
 * Runs when the user presses the "Run" button after selecting their indicator weights.
 */
export function drawHeights(map, source) {
  // TODO: maybe move this function to boundaries.js or just keep it idk

  // outline:
  // construct an array that stores edges with their associated womble value as objects
  // use setPaintProperty on the boundaries layer to set the extrusion heights based on this constructed array
  // this can be achieved with a 'match' expression
  // idea drawn from: https://docs.mapbox.com/mapbox-gl-js/example/data-join/

  const HEIGHT_MULTIPLIER = 0.1;
  let edges = source["features"]; // get all edges from the source into one array
  let edgeCalculation = []; // output array, where each element is an edge object containing their associated calculated womble value

  // create our output calculations array
  for (let edge of edges) {
    // create the output "row" then add it to our calculations array
    // TODO: the keys are hardcoded here, what happens if the data is using sa2 id's ? have to think of a more dynamic approach. perhaps we specify that the area id's have to be name area_id1 and area_id2
    let output = {
      ogc_fid: edge["properties"]["ogc_fid"],
      sa1_id1: edge["properties"]["sa1_id1"],
      sa1_id2: edge["properties"]["sa1_id2"],
      womble: calculateWomble(edge), // TODO: replace this with a call to the calculateWomble function once it's complete
    };
    edgeCalculation.push(output);
  }

  console.log(edgeCalculation);

  // TODO: create a womble_scaled property as well by finding the max womble value and then dividing each womble value by the max
  // then use womble_scaled to draw the heights

  // building a match expression to get each boundary's womble value, using the ogc_fid as the lookup key
  let matchExpression = ["match", ["get", "ogc_fid"]];

  // calculate height of each edge and add to the match expression
  for (let edge of edgeCalculation) {
    let height;
    // if womble value exists for this edge, use it to calculate the edge's height
    if ("womble" in edge) {
      height = edge["womble"] * HEIGHT_MULTIPLIER;
    }
    // else set the height to zero (?)
    else {
      height = 0;
    }

    matchExpression.push(edge["ogc_fid"], height);
  }

  // make the fallback value null or zero? it shouldnt really matter since i think ill code it such that all the ids match
  matchExpression.push(0);
  // console.log(matchExpression);
  map.setPaintProperty("boundary", "fill-extrusion-height", matchExpression);
}

/**
 * Calculates the womble value for a particular edge
 * @param {Number} edge object corresponding to the edge that the womble calculation is being done for
 * @returns {Number} womble value
 */
export function calculateWomble(edge) {
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

  // console.log(selectedIndicators);
  // console.log(indicatorWeights);

  let womble = 0;

  // find the elements in the indicators csv array that corresponds to the edges neighbouring areas
  let area1 = indicatorsData.find(
    (area) => area["sa1"] == edge["properties"]["sa1_id1"] // TODO: will have to update area code name, hardcoded to sa1_id1 for now
  );

  let area2 = indicatorsData.find(
    (area) => area["sa1"] == edge["properties"]["sa1_id2"] // TODO: will have to update area code name, hardcoded to sa1_id2 for now
  );

  // actual womble calculation is done here
  for (let i = 0; i < selectedIndicators.length; i++) {
    // if either or both of the areas are undefined it means the indicators csv doesn't have data for that area and therefore we cannot calculate a womble value for that edge
    if (area1 == undefined || area2 == undefined) {
      womble = 0;
      break;
    }
    // otherwise we have data for both areas
    else {
      // womble += indicatorWeights[i] * absolute difference of (area1's selectedIndicator[i] value and area2's selectedIndicator[i] value)
      womble +=
        indicatorWeights[i] *
        Math.abs(
          parseFloat(area1[selectedIndicators[i]]) -
            parseFloat(area2[selectedIndicators[i]])
        );
    }
  }

  // womble = 0.5; // TODO: DELETE LATER HARDCODED FOR NOW
  return womble;
}
