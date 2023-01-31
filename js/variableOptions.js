export function createVariables(optionsArray) {

    for (let i = 0; i < optionsArray.length; i++) {
        // let option = document.createElement("INPUT");
        // option.setAttribute("type", "checkbox");
        // option.setAttribute("id", `variable-${i}`);

        var node = document.createElement('div');
        node.setAttribute("class", "form-check");
        node.innerHTML = '<input class="form-check-input" type="checkbox" id="variable-' + i + '" name="check' + i + '"><label class="form-check-label" for="variable-' + i + '">' + optionsArray[i] + '</label>';



        const divID = document.getElementById("options");
        divID.appendChild(node);

        setTimeout(function () {$('#' + gear.id).selectpicker();}, 300)

    }

}