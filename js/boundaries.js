import {
  csvAreaCode,
  getGeojsonAreaCode,
  indicatorsData,
  selectedVariables,
} from "./index.js";

/**
 * Draws a map layer of the user's selected boundaries. No heights or colours are drawn yet.
 * @param {*} map the mapbox map object that we're working on
 */
export function initMapBoundaries(map, sourceData) {
  // source defines the data to be drawn
  let source = {
    type: "geojson",
    data: sourceData,
  };

  if (map.getSource("boundariesSource")) {
    map.removeLayer("boundaries");
    map.removeSource("boundariesSource");
  }

  map.addSource("boundariesSource", source);
  addBoundariesLayer(map);

  console.log("Map boundaries initialised");
}

export function addBoundariesLayer(map) {
  // layer defines how to display the source
  let boundaries = {
    id: "boundaries", // this needs to be unique
    type: "line",
    source: "boundariesSource",
    paint: {
      "line-color": "black",
      "line-width": 0.2,
    },
  };

  map.addLayer(boundaries);
}

export function initMapAreas(map, sourceData) {
  // source defines the data to be drawn
  let source = {
    type: "geojson",
    data: sourceData,
  };

  if (map.getSource("areasSource")) {
    map.removeLayer("areas");
    map.removeSource("areasSource");
  }

  map.addSource("areasSource", source);
  addAreasLayer(map);

  console.log("Map areas initialised");
}

export function addAreasLayer(map) {
  // layer defines how to display the source
  let areas = {
    id: "areas", // this needs to be unique
    type: "fill",
    source: "areasSource",
    paint: {
      "fill-color": "blue",
      "fill-opacity": 0.3,
    },
    filter: ["boolean", false], // initialise filter to show no features by setting false
  };

  map.addLayer(areas);
}

/**
 * Adds clickable wall behaviour. Upon clicking a wall, a popup appears with relevant info and the wall's adjacent areas are highlighted
 * @param {*} map mapbox map
 */
export function initClickableWallBehaviour(map) {
  map.on("click", "walls", (e) => {
    closeExistingPopups(map);
    let wall = e.features[0];

    // raw and scaled womble values rounded to 3 dec places
    let rawWomble = wall.properties.womble.toFixed(3);
    let scaledWomble = wall.properties.womble_scaled.toFixed(3);
    let description = `Raw womble: ${rawWomble} <br> Scaled womble: ${scaledWomble} <br> Neighbouring area IDs: <br> ${wall.properties.sa1_id1}, <br> ${wall.properties.sa1_id2}`;
    console.log(wall);

    // area IDs are converted to strings b/c they'll be compared to the SA1 area properties which are strings
    let areaIds = [
      wall.properties.sa1_id1.toString(),
      wall.properties.sa1_id2.toString(),
    ];

    // create popup
    let popup = new mapboxgl.Popup({ closeOnClick: false });
    popup.setLngLat(e.lngLat);
    popup.setHTML(description);
    popup.addClassName("wall-popup");
    popup.addTo(map);

    // closing the popup unhighlights the neighbouring areas
    popup.on("close", () => {
      closeExistingPopups(map);
      // map.setFilter("areas", ["boolean", false]);
    });

    // highlights the neighbouring areas
    // uses setFilter to display only the features in the "areas" layer which match the area IDs adjacent to the clicked wall
    // here we're using the property SA1_MAIN16 as the area ID
    // TODO: maybe modify this/future sa1 area files to use a more homogenous property name (e.g. area_id)
    map.setFilter("areas", [
      "in",
      ["get", getGeojsonAreaCode()],
      ["literal", areaIds],
    ]);
  });

  // change mouse pointer upon hovering over walls
  map.on("mouseenter", "walls", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "walls", () => {
    map.getCanvas().style.cursor = "";
  });
}

export function initClickableAreaBehaviour(map) {
  map.on("click", "areas", (e) => {
    let area = e.features[0];
    console.log(area);
    let areaCode = area["properties"][getGeojsonAreaCode()];

    // find indicators that correspond with the area that was clicked on
    let correspondingIndicators = indicatorsData.find((indicators) => {
      let indicatorsCode = indicators[csvAreaCode]; // csvAreaCode is global and initialised in setIndicatorsData()

      // if code is a number, convert it to string
      if (!isNaN(indicatorsCode)) {
        indicatorsCode = indicatorsCode.toString(); // both codes have to be strings for comparison
      }

      return indicatorsCode == areaCode;
    });

    // let selectedIndicators = selectedVariables;
    correspondingIndicators = Object.entries(correspondingIndicators); // convert indicators object to an array

    // filter out any indicators that were NOT selected by user, i.e. keep only selected indicators
    correspondingIndicators = correspondingIndicators.filter(
      ([key, value]) => selectedVariables.includes(key) // selectedVariables is a global
    );
    console.log(correspondingIndicators);

    let description = `Area ID: ${areaCode}, <br> Selected Indicators: <br>`;

    for (let [key, value] of correspondingIndicators) {
      description += `${key}: ${value}, <br>`;
    }

    // create popup
    let popup = new mapboxgl.Popup({ closeOnClick: false });
    popup.setLngLat(e.lngLat);
    popup.setHTML(description);
    popup.addClassName("area-popup");
    popup.addTo(map);
  });

  map.on("mouseenter", "areas", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "areas", () => {
    map.getCanvas().style.cursor = "";
  });
}

export function closeExistingPopups(map) {
  let popups = document.getElementsByClassName("mapboxgl-popup");
  while (popups.length > 0) {
    popups[0].remove();
  }

  // unhighlight selected areas
  map.setFilter("areas", ["boolean", false]);
}
