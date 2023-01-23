// import geoJsonData from "../boundaries_SA1_2016.geojson" assert { type: "json" }; // app must be open on live server for imports/fetching to work
// import geoJsonData from "../vic.geojson" assert { type: "json" };
// import geoJsonData from "../dummy.geojson" assert { type: "json" }; // dummy data based on liveability geojson, with some coordinates manually converted using epsg.io

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

  map.addSource("boundariesSource", source);

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
  console.log("Map boundaries initialised");
}

export function initMapAreas(map, sourceData) {
  // source defines the data to be drawn
  let source = {
    type: "geojson",
    data: sourceData,
  };

  map.addSource("areasSource", source);

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
  console.log("Map areas initialised");
}

/**
 * Adds clickable wall behaviour. Upon clicking a wall, a popup appears with relevant info and the wall's adjacent areas are highlighted
 * @param {*} map mapbox map
 */
export function initClickableWallBehaviour(map) {
  map.on("click", "walls", (e) => {
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

    new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(description).addTo(map);

    // highlights the neighbouring areas
    // uses setFilter to display only the features in the "areas" layer which match the area IDs adjacent to the clicked wall
    // here we're using the property SA1_MAIN16 as the area ID
    // TODO: maybe modify this/future sa1 area files to use a more homogenous property name (e.g. area_id)
    map.setFilter("areas", ["in", ["get", "SA1_MAIN16"], ["literal", areaIds]]);
  });
}
