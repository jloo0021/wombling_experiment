import { indicatorsData, setIndicatorsData } from "./index.js";

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
  const reader = new FileReader();

  reader.onload = function (e) {
    setIndicatorsData(csvToArr(e.target.result, ","));
  };

  reader.readAsText(file);
}

function csvToArr(stringVal, splitter) {
  const [keys, ...rest] = stringVal
    .replace(/['"]+/g, "") // gets rid of quotation marks from the csv data
    .trim()
    .split("\n")
    .map((item) => item.split(splitter));

  console.log([keys]);

  const formedArr = rest.map((item) => {
    const object = {};
    keys.forEach((key, index) => (object[key] = parseFloat(item.at(index))));
    return object;
  });
  return formedArr;
}