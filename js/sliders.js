/**
 * Creates the indicator weight sliders for the user to adjust the weights for the womble calculation.
 * @param {*} indicators array of strings, each string is an indicator that the user has selected for the wombling calculation
 */
export function createIndicatorSliders(indicators) {
  let wombleSliders = document.querySelectorAll(".slider-container");

  // remove existing indicator sliders
  wombleSliders.forEach((element) => {
    element.remove();
  });

  // create the HTML elements required for each slider
  for (let i = 0; i < indicators.length; i++) {
    let indicator = indicators[i];

    // create a div that contains: a span for the indicator name, a span for the slider value, and the input slider
    // e.g.
    // <div class="slider-container">
    //   <span>Indicator 2:</span>
    //   <span id="slider-display-1">x%</span>
    //   <input id="slider1" type="range" min="0" max="100" step="0.01" value="20">
    // </div>

    let sliderContainer = document.createElement("div");
    sliderContainer.classList.add("slider-container");

    // // indicator name
    // let indicatorName = document.createElement("span");
    // indicatorName.innerText = `${indicator}: `;

    // slider display value
    let sliderValue = document.createElement("span");
    sliderValue.setAttribute("id", `slider-display-${i}`);
    sliderValue.setAttribute("slidervalue", ""); // boolean attribute to help us recognise this as a slider value element later

    // slider input
    let sliderInput = document.createElement("input");
    sliderInput.setAttribute("id", `slider-${i}`);
    sliderInput.setAttribute("type", "range");
    sliderInput.setAttribute("min", "0");
    sliderInput.setAttribute("max", "100");
    sliderInput.setAttribute("step", "0.01");
    sliderInput.setAttribute("sliderinput", ""); // boolean attribute to help us recognise this as a slider input element later
    sliderInput.setAttribute("indicatorname", indicator); // attribute that tells us which indicator this slider is associated with

    // append elements accordingly
    // sliderContainer.appendChild(indicatorName);
    sliderContainer.appendChild(sliderValue);
    sliderContainer.appendChild(sliderInput);

    // append the slider underneath its corresponding checkbox
    // this code below is dependent on the way the variable checkboxes are coded, so probably not the cleanest code here
    let options = document.getElementById("options");
    for (let option of options.children) {
      if (option.children[0].innerText == indicator) {
        option.children[0].after(sliderContainer);
      }
    }
  }
  setDefaultWeights();
  addDependendentSliderBehaviour();

  // Add the womble indicators buttons
  // document.getElementById('womble-indicators-sliders').classList.remove("hide");
  document.getElementById("womble-indicators-buttons").classList.remove("hide");
}

/**
 * Updates the innerText of the span that displays the value associated with a particular slider element.
 * This function is dependent on the slider container structure, where the display value is a sibling element of the input slider element
 * @param {*} slider HTML input element to be updated, value is the
 * @param {*} value number to set the slider value to
 */
function updateSliderDisplayValue(slider, value) {
  let container = slider.parentElement;

  // loop over the container's children until it finds the display value element, then set its innerText to the given value
  for (let i = 0; i < container.childElementCount; i++) {
    if (container.children[i].hasAttribute("slidervalue")) {
      container.children[i].innerText = `${value.toFixed(2)}%`;
    }
  }
}

/**
 * Function to retrieve references to all indicator slider elements
 * @returns an array containing all indicator slider elements
 */
export function retrieveIndicatorSliders() {
  // this is the div that contains all the sliders
  let wombleSliders = document.querySelectorAll(".slider-container");

  // an example slider container should look like:
  // <div class="slider-container">
  //   <span>Indicator 2:</span>
  //   <span id="slider-display-1">x%</span>
  //   <input id="slider1" type="range" min="0" max="100" step="0.01" value="20">
  // </div>
  //
  // get all slider input elements into one array, so that they can be accessed easily later

  let sliders = [];
  for (let i = 0; i < wombleSliders.length; i++) {
    let sliderContainer = wombleSliders[i];
    for (let j = 0; j < sliderContainer.childElementCount; j++) {
      let elem = sliderContainer.children[j];
      if (elem.hasAttribute("sliderinput")) {
        sliders.push(elem);
      }
    }
  }
  return sliders;
}

/**
 * Makes all sliders in the womble sliders div dependent on each other, i.e. if the user moves one slider, the other sliders' values change proportionally such that all slider values sum to 100
 */
function addDependendentSliderBehaviour() {
  let sliders = retrieveIndicatorSliders();

  // add event listeners for each slider
  for (let i = 0; i < sliders.length; i++) {
    sliders[i].addEventListener("mouseup", (e) => {
      const MAX = 100;

      // update this slider's display value
      updateSliderDisplayValue(e.target, parseFloat(e.target.value));

      // calculate difference between the current slider value and the max (so that we can distribute the difference across the other sliders)
      let difference = MAX - e.target.value;

      // create array of all other sliders other than the one being updated, and sum of all their values
      // this array of "other" sliders is needed so we can dynamically adjust their values later
      let otherSliders = [];
      let otherSlidersSum = 0;
      for (let j = 0; j < sliders.length; j++) {
        if (i != j) {
          otherSliders.push(sliders[j]);
          otherSlidersSum += parseFloat(sliders[j].value);
        }
      }

      let currentSum = parseFloat(sliders[i].value);
      // change the other slider values
      for (let j = 0; j < otherSliders.length; j++) {
        if (j == otherSliders.length - 1) {
          // the last slider is set to whatever makes the total sum equal the max (i.e. fixes rounding errors)
          otherSliders[j].value = MAX - currentSum;
          updateSliderDisplayValue(otherSliders[j], MAX - currentSum);
        } else {
          let fraction;
          if (otherSlidersSum == 0) {
            // if all other slider values equal 0, then we allocate the difference equally among the other sliders
            fraction = 1 / otherSliders.length;
          } else {
            fraction = parseFloat(otherSliders[j].value) / otherSlidersSum;
          }
          otherSliders[j].value = fraction * difference;
          updateSliderDisplayValue(otherSliders[j], fraction * difference);
          currentSum += parseFloat(otherSliders[j].value);
        }
      }

      // TODO: delete this later, it's just to test that values sum to 100
      let testSum = 0;
      for (let j = 0; j < sliders.length; j++) {
        testSum += parseFloat(sliders[j].value);
      }
      console.log(`Sum indicator values: ${testSum}`);
    });
  }
}

/**
 * Resets the indicator slider weights to default (equally weighted)
 * Dependent on the current slider container structure, where each container is a div containing a span element for the slider display value and an input element for the slider
 */
export function setDefaultWeights() {
  let wombleSliders = document.querySelectorAll(".slider-container");
  let numIndicators = wombleSliders.length;
  const MAX = 100;
  const DEFAULT_WEIGHT = parseFloat((MAX / numIndicators).toFixed(2)); // all sliders should start off equally weighted (rounded to 2 dp)
  let currentSum = 0; // tracks current sum of the indicator weights; used to help ensure a total sum of 100 by the end

  // loop over each slider container
  for (let i = 0; i < numIndicators; i++) {
    let container = wombleSliders[i];
    let sliderValue;
    let sliderInput;

    // retrieve this container's slider display value and slider input elements
    for (let j = 0; j < container.childElementCount; j++) {
      let elem = container.children[j];

      // slider display value
      if (elem.hasAttribute("slidervalue")) {
        sliderValue = elem;
      }
      // slider input
      else if (elem.hasAttribute("sliderinput")) {
        sliderInput = elem;
      }
    }

    // set both the indicator display value and the slider input value
    // make the last indicator have a weight that brings the sum of the weights to 100
    if (i == numIndicators - 1) {
      sliderValue.innerText = `${(MAX - currentSum).toFixed(2)}%`;
      sliderInput.value = MAX - currentSum;
    } else {
      // every indicator except the last one can just have the default weight
      sliderValue.innerText = `${DEFAULT_WEIGHT}%`;
      sliderInput.value = DEFAULT_WEIGHT;
      currentSum += DEFAULT_WEIGHT;
    }
  }
}

// Don't need these but might in the future if we refactor

// function createResetIndicatorsButton() {
//   let resetWeightsButton = document.createElement("button");
//   resetWeightsButton.innerText = "Reset";
//   resetWeightsButton.setAttribute("id", "reset-weights-button");
//   resetWeightsButton.addEventListener("click", setDefaultWeights);
//   return resetWeightsButton;
// }

// function createRunWombleButton() {
//   let runWombleButton = document.createElement("button");
//   runWombleButton.innerText = "Run";
//   runWombleButton.setAttribute("id", "run-womble-button");
//   runWombleButton.addEventListener("click", () =>
//     drawHeights(map, boundaries_SA1_2011)
//   );
//   return runWombleButton;
// }

// export function createIndicatorButtons(map, boundarySource) {
//   let indicatorButtonsDiv = document.getElementById(
//     "womble-indicators-buttons"
//   );
//   indicatorButtonsDiv.appendChild(createResetIndicatorsButton());
//   indicatorButtonsDiv.appendChild(createRunWombleButton());
// }
