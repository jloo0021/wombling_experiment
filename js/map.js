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

/**
 * Adds buildings as in part 2 of the tute
 * @param {} map
 */
function addBuildings(map) {
  // add source for current buildings
  map.addSource("buildingSource", {
    type: "vector",
    url: "mapbox://mapbox.mapbox-streets-v7",
  });

  // add the current buildings layer
  map.addLayer({
    id: "currentbuildings",
    source: "buildingSource",
    "source-layer": "building",
    type: "fill-extrusion",
    paint: {
      "fill-extrusion-color": "#999999",
      "fill-extrusion-height": {
        type: "identity",
        property: "height",
      },
      "fill-extrusion-opacity": 0.7,
    },
  });

  // used to colour buildings by status
  let statusNames = ["APPLIED", "APPROVED", "UNDER CONSTRUCTION", "COMPLETED"];
  let statusColors = ["#08519c", "#6baed6", "#c6dbef", "#999999"];

  // colour layers by status
  for (let i = 0; i < statusNames.length; i++) {
    let statusName = statusNames[i];
    let statusColor = statusColors[i];
    map.addLayer({
      id: statusName,
      source: {
        type: "vector",
        url: "mapbox://jloo0021.cg8ftjxl",
      },
      "source-layer": "Development_Activity_Model_Fo-6hmt84",
      type: "fill-extrusion",
      paint: {
        "fill-extrusion-height": {
          type: "identity",
          property: "bldhgt_ahd",
        },
        "fill-extrusion-color": statusColor,
        "fill-extrusion-opacity": 0.7,
      },
      filter: ["==", "status", statusName], // data is filtered so that each loop doesn't fill all the data
    });
  }
}

//mapbox token (taken from existing project)
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiamxvbzAwMjEiLCJhIjoiY2xhdWF1MWVjMDRocTN4cHJ3aWtmcHV6cCJ9.l-bVNNGH2FRP3TJrMZfi4w";

let map = new mapboxgl.Map({
  container: "map",
  center: [144.965, -37.815],
  zoom: 15,
  style: "mapbox://styles/mapbox/light-v11",
  accessToken: MAPBOX_TOKEN,
  pitch: 45,
  bearing: -17.6,
  antialias: true,
});

map.addControl(new mapboxgl.NavigationControl());

map.on("load", () => {
  // when map loads, do...
  addBuildings(map);
});
