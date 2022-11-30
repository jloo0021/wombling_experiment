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
 * Processes the source data so that it can be drawn using mapbox API
 */
function processData(sourceData) {
  // sourceData.features[0].geometry.type = "Polygon";
  // console.log(sourceData);
  return turf.buffer(sourceData, 0.01, { units: "meters" }); // turns lines into polygons that can be extruded
}

/**
 * Draws a boundary between two areas on the map
 * @param {*} map
 */
export function drawBoundary(map, sourceData) {
  // map is the mapbox map object that we're working on

  console.log("drawBoundary called");

  // source defines the data
  let source = {
    type: "geojson",
    // data: {
    //   type: "Feature",
    //   properties: {
    //     color: "gray",
    //     height: 1000,
    //     base_height: 0,
    //   },
    //   geometry: {
    //     type: "Polygon",
    //     coordinates: [
    //       [
    //         // dummy data, would have to get this from the areas somehow
    //         [145.23, -37.816],
    //         [145.177, -37.819],
    //       ],
    //     ],
    //   },
    // },
    data: processData(sourceData),
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
      "fill-extrusion-height": 1000,
      // "fill-extrusion-height": ["get", "womble_scaled"], // need to somehow "get" this property and then manipulate it to create a scaled height0
      "fill-extrusion-opacity": 0.5,
    },
  };

  map.addLayer(boundary);
}
