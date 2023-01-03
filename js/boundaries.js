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

  // colors to use for the categories
  const colors = ["#be87b9", "#dcc2dc", "#ebedec", "#b5bcd7"];

  // layer defines how to display the source
  let boundaries = {
    id: "boundaries", // this needs to be unique
    type: "fill",
    source: "boundariesSource",
    paint: {
      // "fill-extrusion-color": [
      //   "case",
      //   [">=", ["to-number", ["get", "womble_scaled"]], 1],
      //   colors[0],
      //   [">=", ["to-number", ["get", "womble_scaled"]], 0.6],
      //   colors[3],
      //   [">=", ["to-number", ["get", "womble_scaled"]], 0.3],
      //   colors[2],
      //   colors[1],
      // ],
      "fill-color": "green",
    },
  };

  map.addLayer(boundaries);
  console.log("Map boundaries initialised");
}
