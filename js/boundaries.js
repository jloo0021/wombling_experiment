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

  map.addSource("boundarySource", source);

  // layer defines how to display the source
  let boundary = {
    id: "boundary", // this needs to be unique
    type: "fill",
    source: "boundarySource",
    paint: {
      "fill-color": "green",
    },
  };

  map.addLayer(boundary);
  console.log("Map boundaries initialised");
}
