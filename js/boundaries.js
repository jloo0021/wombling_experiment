import geoJsonData from "../boundaries_SA1_2016.geojson" assert { type: "json" }; // app must be open on live server for imports/fetching to work

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
export function drawBoundary(map) {
  // map is the mapbox map object that we're working on
  // area1 and area2 are 2 different SAs (this will likely change depending on what the existing code looks like)

  console.log("drawBoundary called");

  // source defines the data
  let source = {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {
        color: "gray",
        height: 1000,
        base_height: 0,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            // dummy data, would have to get this from the areas somehow
            [145.23, -37.816],
            [145.177, -37.819],
          ],
        ],
      },
    },
  };

  map.addSource("boundarySource", source);

  // layer defines how to display the source
  let boundary = {
    id: "boundary", // this needs to be unique
    type: "fill-extrusion",
    source: source,
    paint: {
      "fill-extrusion-color": ["get", "color"],
      "fill-extrusion-height": ["get", "height"],
      "fill-extrusion-base": ["get", "base_height"],
      "fill-extrusion-opacity": 0.5,
    },
  };

  map.addLayer(boundary);
}
