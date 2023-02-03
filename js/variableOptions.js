
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
        
        var node = document.createElement('div');
        node.setAttribute("class", "form-check");
        // node.innerHTML = '<input type="checkbox" id="variable-' + i + '" name="check' + i + '"><label class = "checkbox-container"  for="variable-' + i + '">' + optionsArray[i] + '</label>';

        node.innerHTML = '<label class = "checkbox-container"  for="variable-' + i + '">' + optionsArray[i] +
            '<input type="checkbox" id="variable-' + i + '" name="check' + i + '"><span class="checkmark"></span></label>';


        divID.appendChild(node);

        // setTimeout(function () {$('#' + gear.id).selectpicker();}, 300)
    }

    firstUpload = false;
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