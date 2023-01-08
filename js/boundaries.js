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
    type: "fill",
    source: "boundariesSource",
    paint: {
      "fill-color": "green",
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
