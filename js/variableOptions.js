import { createIndicatorSliders } from "./sliders.js";

var firstUpload = true;

export function createVariables(optionsArray) {
  const divID = document.getElementById("options");

  if (!firstUpload) {
    while (divID.firstChild) {
      divID.removeChild(divID.lastChild);
    }
  }

  for (let i = 0; i < optionsArray.length; i++) {
    // let option = document.createElement("INPUT");
    // option.setAttribute("type", "checkbox");
    // option.setAttribute("id", `variable-${i}`)

    var node = document.createElement("div");
    node.setAttribute("class", "form-check");
    // node.innerHTML = '<input type="checkbox" id="variable-' + i + '" name="check' + i + '"><label class = "checkbox-container"  for="variable-' + i + '">' + optionsArray[i] + '</label>';

    node.innerHTML =
      '<label class = "checkbox-container"  for="variable-' +
      i +
      '">' +
      optionsArray[i] +
      '<input type="checkbox" id="variable-' +
      i +
      '" name="check' +
      i +
      '"><span class="checkmark"></span></label>';

    divID.appendChild(node);

    // add event listener to each checkbox
    let checkbox = document.getElementById(`variable-${i}`);
    checkbox.addEventListener("click", variableCheckboxHandler);

    // setTimeout(function () {$('#' + gear.id).selectpicker();}, 300)
  }

  firstUpload = false;
}

/**
 * When a variable checkbox is clicked, all variables checkboxes are scanned.
 * Indicator sliders are created for all checkboxes that are checked.
 */
function variableCheckboxHandler() {
  let selectedVariables = [];
  let optionsDiv = document.getElementById("options");

  for (let i = 0; i < optionsDiv.childElementCount; i++) {
    // the code for declaring checkbox and varName is pretty wack, but that's just how we retreive it based on the current structure of the checkboxes
    // if we change the HTML structure, we'll have to change these lines
    let checkbox = optionsDiv.children[i].children[0].querySelector("input");

    if (checkbox.checked) {
      let varName = optionsDiv.children[i].children[0].textContent;
      selectedVariables.push(varName);
    }
  }
  createIndicatorSliders(selectedVariables);
}

function getSelectValues(optionsArray) {
  let values = [];
  for (let i = 0; i < optionsArray.length; i++) {
    let currentVariable = document.getElementById(`variable-${i}`);

    if (currentVariable.checked) {
      // make indicator slider visisble
      // createIndicatorSliders(currentVariable.innerText, i);
      values.push(optionsArray[i]);
    }
  }

  return values;
}

export { getSelectValues };
