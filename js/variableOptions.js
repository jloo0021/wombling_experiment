export function createVariables(optionsArray) {

    for (let i = 0; i < optionsArray.length; i++) {
        // let option = document.createElement("INPUT");
        // option.setAttribute("type", "checkbox");
        // option.setAttribute("id", `variable-${i}`);

        var node = document.createElement('div');
        node.setAttribute("class", "form-check");
        node.innerHTML = '<input type="checkbox" id="variable-' + i + '" name="check' + i + '"><label  for="variable-' + i + '">' + optionsArray[i] + '</label>';



        const divID = document.getElementById("options");
        divID.appendChild(node);

        // setTimeout(function () {$('#' + gear.id).selectpicker();}, 300)

    }

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