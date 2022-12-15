let wombleDiv = document.getElementById("womble-indicators");

// get all slider elements into one array, so that they can be accessed easily later
// initialise a slider values array to store input values BEFORE they are changed by a user

let sliders = [];
for (let i = 0; i < wombleDiv.childElementCount; i++) {
  let elem = wombleDiv.children[i];
  if (elem.nodeName == "INPUT") {
    sliders.push(elem);
  }
}

// add event listeners for each slider
for (let i = 0; i < sliders.length; i++) {
  sliders[i].addEventListener("mouseup", (e) => {
    const MAX = 100;

    // calculate difference between the current slider value and the max (so that we can distribute the difference across the other sliders)
    let difference = MAX - e.target.value;

    // create array of all other sliders other than the one being updated, and sum of all their values
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
      } else {
        let fraction;
        if (otherSlidersSum == 0) {
          // if all other slider values equal 0, then we allocate the difference equally among the other sliders
          fraction = 1 / otherSliders.length;
        } else {
          fraction = parseFloat(otherSliders[j].value) / otherSlidersSum;
        }
        otherSliders[j].value = fraction * difference;
        currentSum += parseFloat(otherSliders[j].value);
      }
    }

    let testSum = 0;
    // to test that values sum to 100
    for (let j = 0; j < sliders.length; j++) {
      testSum += parseFloat(sliders[j].value);
    }
    console.log(`sum values: ${testSum}`);
  });
}
