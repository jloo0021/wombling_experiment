function createIndicatorSliders(indicators) {
  // indicators is an array of strings, each string is an indicator that the user has selected for the wombling calculation

  let wombleDiv = document.getElementById("womble-indicators"); // the element that all the sliders will be contained in
  const DEFAULT_WEIGHT = 100 / indicators.length; // all sliders should start off equally weighted

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

    let indicatorName = document.createElement("span");
    indicatorName.innerText = `${indicator}: `;

    let sliderValue = document.createElement("span");
    sliderValue.innerText = `${DEFAULT_WEIGHT.toFixed(2)}%`; // rounded to 2 decimal places
    sliderValue.setAttribute("id", `slider-display-${i}`);
    sliderValue.setAttribute("slidervalue", ""); // boolean attribute to help us recognise this as a slider value element later

    let sliderInput = document.createElement("input");
    sliderInput.setAttribute("id", `slider-${i}`);
    sliderInput.setAttribute("type", "range");
    sliderInput.setAttribute("min", "0");
    sliderInput.setAttribute("max", "100");
    sliderInput.setAttribute("step", "0.01");
    sliderInput.setAttribute("value", DEFAULT_WEIGHT);

    // append elements accordingly
    sliderContainer.appendChild(indicatorName);
    sliderContainer.appendChild(sliderValue);
    sliderContainer.appendChild(sliderInput);
    wombleDiv.appendChild(sliderContainer);
  }
  addDependendentSliderBehaviour();
}

// updates the innerText of the span that displays the value associated with a particular slider element
// slider is a HTML input element, value is the value it's set to
// this function is dependent on the slider container structure, where the display value is a sibling element of the input slider element
function updateSliderDisplayValue(slider, value) {
  let container = slider.parentElement;

  // loop over the container's children until it finds the display value element, then set its innerText to the given value
  for (let i = 0; i < container.childElementCount; i++) {
    if (container.children[i].hasAttribute("slidervalue")) {
      container.children[i].innerText = `${value.toFixed(2)}%`;
    }
  }
}

function addDependendentSliderBehaviour() {
  let wombleDiv = document.getElementById("womble-indicators");

  // an example slider container should look like:
  // <div class="slider-container">
  //   <span>Indicator 2:</span>
  //   <span id="slider-display-1">x%</span>
  //   <input id="slider1" type="range" min="0" max="100" step="0.01" value="20">
  // </div>
  //
  // get all slider input elements into one array, so that they can be accessed easily later

  let sliders = [];
  for (let i = 0; i < wombleDiv.childElementCount; i++) {
    let sliderContainer = wombleDiv.children[i];
    for (let j = 0; j < sliderContainer.childElementCount; j++) {
      let elem = sliderContainer.children[j];
      if (elem.nodeName == "INPUT") {
        sliders.push(elem);
      }
    }
  }

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
      console.log(`sum values: ${testSum}`);
    });
  }
}

createIndicatorSliders(["ind 1", "ind 2", "ind 3", "test", "density"]);
