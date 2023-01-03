let uploadBtn = document.querySelector("#csvInput");
const customTxt = document.getElementById("custom-text");
uploadBtn.addEventListener("change", changeBG);
let csvArray;

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
    csvArray = csvToArr(e.target.result, ",");
    console.log(csvArray);
  };

  reader.readAsText(file);
}

function csvToArr(stringVal, splitter) {
  const [keys, ...rest] = stringVal
    .trim()
    .split("\n")
    .map((item) => item.split(splitter));

  const formedArr = rest.map((item) => {
    const object = {};
    keys.forEach((key, index) => (object[key] = item.at(index)));
    return object;
  });
  return formedArr;
}
