import { addAreasLayer, addBoundariesLayer } from "./boundaries.js";
import { addWallsLayer } from "./womble.js";

function darkCheckboxHandler(map) {
  switchStyle(map, "mapbox://styles/mapbox/dark-v11");
}

function lightCheckboxHandler(map) {
  switchStyle(map, "mapbox://styles/mapbox/light-v11");
}

function satelliteCheckboxHandler(map) {
  switchStyle(map, "mapbox://styles/mapbox/satellite-v9");
}

function switchStyle(map, styleUrl) {
  // get all layers
  let layers = [];
  let layerIds = ["areas", "boundaries", "walls"];
  for (let id of layerIds) {
    if (map.getLayer(id)) {
      let mapLayer = map.getLayer(id);

      // rebuild layer object the way the mapbox api wants it for addLayer()
      let layerObj = {
        id: mapLayer.id,
        type: mapLayer.type,
        source: mapLayer.source,
        // paint: mapLayer.paint,
      };

      layers.push(layerObj);

      // remove all layers from the map
      map.removeLayer(id);
    }
  }

  // get all sources
  let sources = [];
  let sourceIds = [
    "areasSource",
    "boundariesSource",
    "bufferedSource",
    "unbufferedSource",
    "wallsSource",
  ];

  for (let id of sourceIds) {
    if (map.getSource(id)) {
      let mapSource = map.getSource(id);
      let idSourcePair = {};

      // rebuild source object the way the mapbox api wants it for addSource()
      let sourceObj = {
        type: mapSource.type,
        data: mapSource._data,
      };

      // push the key value pair to the sources array
      idSourcePair[id] = sourceObj;
      sources.push(idSourcePair);

      // remove all sources from the map
      map.removeSource(id);
    }
  }

  // switch styles
  map.setStyle(styleUrl);

  let readdSourcesAndLayers = function () {
    // re-add sources and layers
    for (let idSourcePair of sources) {
      for (let [id, source] of Object.entries(idSourcePair)) {
        map.addSource(id, source);
      }
    }

    addBoundariesLayer(map);
    addAreasLayer(map);
    addWallsLayer(map);
  };

  // only re-add the sources/layers once the style has loaded
  map.once("style.load", readdSourcesAndLayers);
}

export function addStyleListeners(map) {
  document.getElementById("dark-checkbox").addEventListener("click", () => {
    darkCheckboxHandler(map);
  });

  document.getElementById("light-checkbox").addEventListener("click", () => {
    lightCheckboxHandler(map);
  });

  document
    .getElementById("satellite-checkbox")
    .addEventListener("click", () => {
      satelliteCheckboxHandler(map);
    });
}
