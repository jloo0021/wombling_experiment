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
 * Create buttons that filter layers. These buttons are appended to a nav element
 */
function createButtons(name, colour) {
  let link = document.createElement("a"); // create a hyperlink HTML element
  link.href = "#";
  link.className = "active";
  link.textContent = name;
  link.style.backgroundColor = colour;
  link.onclick = function (e) {
    let clickedLayer = this.textContent;
    e.preventDefault();
    e.stopPropagation();
    let visibility = map.getLayoutProperty(clickedLayer, "visibility");
    // make layer visible / not visible when clicked.
    // ** hard coded to combine the currentbuildings with completed buildings **
    if (clickedLayer == "COMPLETED" && visibility === "visible") {
      map.setLayoutProperty(clickedLayer, "visibility", "none");
      map.setLayoutProperty("currentbuildings", "visibility", "none");
      this.className = "";
    } else if (visibility === "visible") {
      map.setLayoutProperty(clickedLayer, "visibility", "none");
      this.className = "";
    } else if (clickedLayer == "COMPLETED") {
      map.setLayoutProperty(clickedLayer, "visibility", "visible");
      map.setLayoutProperty("currentbuildings", "visibility", "visible");
      this.className = "active";
    } else {
      this.className = "active";
      map.setLayoutProperty(clickedLayer, "visibility", "visible");
    }
  };
  let layers = document.getElementById("button"); // get HTML nav element that contains the layer filter buttons
  layers.appendChild(link);
}

/**
 * Adds buildings as in part 2 of the tute
 * @param {} map
 */
function addBuildings(map) {
  // used for creating popups on hover
  let popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

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

    // adding automatic popup open/close
    map.on("mouseenter", statusName, (e) => {
      // when mouse enters statusName layer, event is triggered and this runs...
      map.getCanvas().style.cursor = "pointer"; // change cursor style to pointer
      popup
        .setLngLat(e.lngLat) // set the coordinates of the popup

        // add a bunch of info to the popup based on the event data
        .setHTML(
          e.features[0].properties.status +
            ": " +
            e.features[0].properties.address +
            "<br> Expected Height: " +
            e.features[0].properties.bldhgt_ahd + // building height
            "m / " +
            e.features[0].properties.num_floors +
            " storeys <br> Proposed Use: " +
            e.features[0].properties.land_use_1 +
            ", " +
            e.features[0].properties.land_use_2 +
            ", " +
            e.features[0].properties.land_use_3
        )

        .addTo(map);
    });

    // remove popup when mouse leaves layer
    map.on("mouseleave", statusName, () => {
      map.getCanvas().style.cursor = ""; // remove cursor style
      popup.remove();
    });

    createButtons(statusName, statusColor); // create buttons to filter layers
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
