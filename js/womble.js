/**
 * Calculates the womble values for each boundary (and appends it as a geojson feature property?).
 * Runs when the user presses the "Run" button after selecting their indicator weights.
 */
function wombleCalc() {
  // retrieve all indicator weight values into an array
  let wombleDiv = document.getElementById("womble-indicators"); // the element that all the sliders will be contained in
  let numIndicators = wombleDiv.childElementCount;
  let indicatorWeights = [];

  for (let i = 0; i < numIndicators; i++) {
    let container = wombleDiv.children[i];

    // loop over the container's children until it finds the input slider element, then retrieve its value
    for (let j = 0; j < container.childElementCount; j++) {
      if (container.children[j].hasAttribute("sliderinput")) {
        indicatorWeights.push(parseFloat(container.children[j].value));
      }
    }
  }
  console.log(indicatorWeights);
}
