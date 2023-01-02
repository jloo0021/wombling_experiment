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
