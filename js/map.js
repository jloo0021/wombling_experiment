/**
 * Draws a boundary between two areas on the map
 * @param {*} map
 * @param {*} area1
 * @param {*} area2
 */
function drawBoundary(map, area1, area2) {
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

//mapbox token (taken from existing project)
const MAPBOX_TOKEN =
  "pk.eyJ1IjoibmR1bzAwMDMiLCJhIjoiY2tnNHlucmF3MHA4djJ6czNkaHRycmo1OCJ9.xfU4SWH35W5BYtJP8VnTEA";

const DUMMY_DATA = {
  area1: {
    population: 1000,
  },
  area2: {
    population: 2000,
  },
};

let map = new mapboxgl.Map({
  container: "map",
  // center: [144.9631, -37.9631], // long lat of melb
  center: [145.2, -37.817], // long lat of east side melb
  zoom: 14,
  style: "mapbox://styles/mapbox/light-v11",
  accessToken: MAPBOX_TOKEN,
  pitch: 45,
  bearing: -17.6,
  antialias: true,
});

map.on("load", () => {
  // when map loads, do...
  drawBoundary(map, DUMMY_DATA.area1, DUMMY_DATA.area2);
});
