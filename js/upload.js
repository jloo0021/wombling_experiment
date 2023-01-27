import { indicatorsData, setIndicatorsData } from "./index.js";
import Papa from "https://cdn.skypack.dev/papaparse@5.3.0";

let uploadBtn = document.querySelector("#csvInput");
const customTxt = document.getElementById("custom-text");
uploadBtn.addEventListener("change", changeBG);

function changeBG(e) {
  e.preventDefault();
  if (uploadBtn.value) {
    customTxt.innerHTML = uploadBtn.value.match(
      /[\/\\]([\w\d\s\.\-\(\)]+)$/
    )[1];
  } else {
    customTxt.innerHTML = "No file chosen, yet";
  }

  const file = e.target.files[0];
  // const reader = new FileReader();

  // reader.onload = function (e) {
  //   setIndicatorsData(csvToArr(e.target.result, ","));
  // };

  // console.log(indicatorsData);

  // reader.readAsText(file);

  let papaParseCallback = function (results) {
    let headers = Object.keys(results.data[0]);
    console.log(`papa: ${results}`);
    console.log(headers);
    setIndicatorsData(results);
  };

  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: papaParseCallback,
  });
}

function csvToArr(stringVal, splitter) {
  const [keys, ...rest] = stringVal
    .replace(/['"]+/g, "") // gets rid of quotation marks from the csv data
    .trim()
    .split("\n")
    .map((item) => item.split(splitter));

  const headers = Object.values(keys);
  console.log(headers);

  const formedArr = rest.map((item) => {
    const object = {};
    keys.forEach((key, index) => (object[key] = parseFloat(item.at(index))));
    return object;
  });
  console.log([formedArr, headers]);
  return [formedArr, headers];

  // return formedArr;
}
