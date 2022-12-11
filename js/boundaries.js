// import geoJsonData from "../boundaries_SA1_2016.geojson" assert { type: "json" }; // app must be open on live server for imports/fetching to work
// import geoJsonData from "../vic.geojson" assert { type: "json" };
// import geoJsonData from "../dummy.geojson" assert { type: "json" }; // dummy data based on liveability geojson, with some coordinates manually converted using epsg.io

// Could also use fetch instead of import
// fetch("./boundaries_SA1_2016.geojson")
//   .then((response) => {
//     return response.json();
//   })
//   .then((data) => console.log(data));

/**
 * Draws a boundary between two areas on the map
 * @param {*} map
 */
export function drawBoundary(map, sourceData) {
  // map is the mapbox map object that we're working on
  const HEIGHT_MULTIPLIER = 1000;

  console.log("drawBoundary called");

  // source defines the data to be drawn
  let source = {
    type: "geojson",
    data: sourceData,
  };

  map.addSource("boundarySource", source);

  // layer defines how to display the source
  let boundary = {
    id: "boundary", // this needs to be unique
    type: "fill-extrusion",
    source: source,
    paint: {
      // "fill-extrusion-color": ["get", "color"],
      // "fill-extrusion-height": ["get", "height"],
      // "fill-extrusion-base": ["get", "base_height"],
      // "fill-extrusion-opacity": 0.5,
      "fill-extrusion-color": "gray",

      // multiplies each features womble scaled property with the height multiplier. see mapbox expressions for details
      "fill-extrusion-height": [
        "*",
        ["get", "womble_scaled"],
        HEIGHT_MULTIPLIER,
      ],
      "fill-extrusion-opacity": 1,
    },
  };

  map.addLayer(boundary);
}
