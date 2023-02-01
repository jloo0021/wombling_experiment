// import { csvArray, csvToArr} from './upload.js';

function createIndicatorOptions(optionsArray, select_id) {
  // if (csvArray.Property == null) {

  // console.log(optionsArray);
  var x = document.getElementById(select_id);

  for (let i = 0; i < optionsArray.length; i++) {
    var option = document.createElement("option");
    option.text = optionsArray[i];
    x.add(option, i);
  }

  var optionsTest = document.getElementById(select_id).options;
  for (var i = 0; i < optionsTest.length; i++) {
    console.log(optionsTest[i].value);
  }
  // }
}

function removeIndicatorOptions() {
  var optionsTest = document.getElementById("indicators-selection").options;
  for (var i = 0; i < optionsTest.length; i++) {
    console.log(optionsTest[i].value);
  }
  var options = document.querySelectorAll("#indicators-selection option");
  options.forEach((o) => o.remove());
  var optionsTest = document.getElementById("indicators-selection").options;
  for (var i = 0; i < optionsTest.length; i++) {
    console.log(optionsTest[i].value);
  }
}

// Return an array of the selected option values
// select is an HTML select element
function gyug(select_id) {
  var options = document.getElementById(select_id).selectedOptions;
  var values = Array.from(options).map(({ value }) => value);
  console.log(values);
  return values;
}

function getValues(select_id) {
  var options = document.getElementById(select_id).options;
  var values = Array.from(options).map(({ value }) => value);
  console.log(values);
  return values;
}

// Exporting variables and functions
export { createIndicatorOptions, removeIndicatorOptions, getValues };
