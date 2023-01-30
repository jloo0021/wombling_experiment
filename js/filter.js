/**
 * Adds the toggling visibility behaviour that occurs when the corresponding layer checkboxes are clicked by the user
 * @param {*} map mapbox map
 */
export function toggleableLayers(map) {
  // enumerate ids of the layers
  // add id's to this array and add a corresponding checkbox to the HTML file to extend functionality to include other layers
  let toggleableLayerIds = ["boundaries", "walls"];

  for (let id of toggleableLayerIds) {
    let layerCheckbox = document.getElementById(`${id}-checkbox`); // all layer filter checkboxes in the HTML file should be in this form
    layerCheckbox.addEventListener("click", (e) => {
      // if the clicked layer doesn't exist, return
      if (!map.getLayer(id)) {
        console.log("Layer not yet rendered");
        return;
      }

      // if the checkbox is checked, make sure the layer is visible by changing the layout object's visibility property
      if (e.target.checked) {
        map.setLayoutProperty(id, "visibility", "visible");
      }
      // if checkbox is NOT checked, make sure the layer is invisible
      else {
        map.setLayoutProperty(id, "visibility", "none");
      }
    });
  }
}

export function colorCheck(map) {
  let id = "walls"
  let colorCheckbox = document.getElementById(`color-checkbox`); // all layer filter checkboxes in the HTML file should be in this form
  colorCheckbox.addEventListener("click", (e) => {
      // if the clicked layer doesn't exist, return
      if (!map.getLayer(id)) {
        console.log("Layer not yet rendered");
        return;
      }

      // if the checkbox is checked, make sure the layer is visible by changing the layout object's visibility property
      if (e.target.checked) {
        let color = "#808080";
        map.setPaintProperty("walls", 'fill-extrusion-color', color);
      }
      // if checkbox is NOT checked, make sure the layer is invisible
      else {
        const colors = ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20"];
        map.setPaintProperty("walls", 'fill-extrusion-color', [
          "case",
          [">=", ["to-number", ["get", "womble_scaled"]], 1],
          colors[3],
          [">=", ["to-number", ["get", "womble_scaled"]], 0.6],
          colors[2],
          [">=", ["to-number", ["get", "womble_scaled"]], 0.3],
          colors[1],
          colors[0],
        ]);
      }
    });
}

export function heightCheck(map) {
  let id = "walls"
  let heightCheckbox = document.getElementById(`height-checkbox`); // all layer filter checkboxes in the HTML file should be in this form
  heightCheckbox.addEventListener("click", (e) => {
      // if the clicked layer doesn't exist, return
      if (!map.getLayer(id)) {
        console.log("Layer not yet rendered");
        return;
      }

      // if the checkbox is checked, make sure the layer is visible by changing the layout object's visibility property
      if (e.target.checked) {
        map.setPaintProperty("walls", 'fill-extrusion-height', 250);
      }
      // if checkbox is NOT checked, make sure the layer is invisible
      else {
        const HEIGHT_MULTIPLIER = 5000;
        map.setPaintProperty("walls", "fill-extrusion-height", [
          "*",
          ["get", "womble_scaled"],
          HEIGHT_MULTIPLIER,
        ]);
      }
    });
}