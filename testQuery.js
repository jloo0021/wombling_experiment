const form = document.querySelector("#csvForm");
const csvFileInput = document.querySelector("#csvInput");
const textArea = document.querySelector("#csvResult");

form.addEventListener("submit", function (event) {
    //logic for when the form is submitted
    event.preventDefault();

    const file = csvFileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        // Access to content with e.target.result
        var csv = event.target.result;
        var data = $.csv.toObjects(csv);
        $('#csvResult').empty();
        $('#csvResult').html(JSON.stringify(data, null, 2));
        // textArea.value = JSON.stringify(csvArray, null, 4);
    };
    reader.readAsText(file);
});

// function csvToArr(stringVal, splitter) {
//     const [keys, ...rest] = stringVal
//         .trim()
//         .split("\n")
//         .map((item) => item.split(splitter));
//     const formedArr = rest.map((item) => {
//         const object = {};
//         keys.forEach((key, index) => (object[key] = item.at(index)));
//         return object;
//     });
//     return formedArr;
// }

