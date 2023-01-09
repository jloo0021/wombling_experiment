// import { csvArray, csvToArr} from './upload.js';
import indicatorsData from "../liveability_indicators_sa1_2016.json" assert { type: "json" };
let optionsArray = [
    "dwelling",
    "person",
    "urban_liveability_index",
    "social_infrastructure_mix",
    "walkability",
    "local_employment",
    "closest_pos",
    "closest_healthy_food",
];

function createIndicatorOptions() {
    // if (csvArray.Property == null) {

    console.log(optionsArray);
    var x = document.getElementById("indicators-selection");


    // const res = JSON.parse("liveability_indicators_sa1_2016.json");

    // Object.entries(res).forEach((entry) => {
    //     const [key, value] = entry;
    //      console.log(`${key}: ${value}`);
    // });

    for (let i = 0; i < optionsArray.length; i++) {
        var option = document.createElement("option");
        option.text = optionsArray[i];
        x.add(option, i);
    }


    // }
}

// Return an array of the selected option values
// select is an HTML select element
function getSelectValues() {
    var options = document.getElementById('select-meal-type').selectedOptions;
    var values = Array.from(options).map(({ value }) => value);
    console.log(values);
}

// Exporting variables and functions
export { createIndicatorOptions, getSelectValues };