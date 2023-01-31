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

export function checkVariables(optionsArray) {

    for (let i = 0; i < optionsArray.length; i++) {
        let currentVariable = document.getElementById(`variable-${i}`);

        heightCheckbox.addEventListener("click", (e) => {

            if (e.target.checked) {
                // make indicator slider visisble
                // createIndicatorSliders(currentVariable.innerText, i);
                
            }
            // if checkbox is NOT checked, make sure the layer is invisible
            else {
                // make indicator slider gone
                let sliderContainer = document.getElementById(`div-${i}`);
                sliderContainer.remove();
            }
        });
    }
}