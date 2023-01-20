import { Dimensions } from "./enums.js";
import { appDimension, setDimension } from "./index.js";

export class DimensionToggle {
  constructor({ pitch = 45 }) {
    this._previousPitch = pitch;
  }

  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this._btn = document.createElement("button");

    // style the dimension toggle button depending on what dimension the app is in (i.e. if app is in 2d mode, show 3d on button)
    if (appDimension == Dimensions.TWO_D) {
      this._btn.className = `mapboxgl-ctrl-icon mapboxgl-ctrl-dimensiontoggle-3d`;
    } else if (appDimension == Dimensions.THREE_D) {
      this._btn.className = `mapboxgl-ctrl-icon mapboxgl-ctrl-dimensiontoggle-2d`;
    }

    // switch dimensions when this button is clicked
    this._btn.addEventListener("click", () => {
      if (appDimension == Dimensions.TWO_D) {
        // switch to 3d
        setDimension(Dimensions.THREE_D);
        this._btn.className = `mapboxgl-ctrl-icon mapboxgl-ctrl-dimensiontoggle-2d`;

        // restore previous pitch
        map.easeTo({
          pitch: this._previousPitch,
          duration: 1000,
        });
        map.setMaxPitch(85); // default max pitch

        // delete thicknesses and draw walls
        this.#convertWallsTo3d(map);
      } else if (appDimension == Dimensions.THREE_D) {
        // switch to 2d
        setDimension(Dimensions.TWO_D);
        this._btn.className = `mapboxgl-ctrl-icon mapboxgl-ctrl-dimensiontoggle-3d`;

        // disable pitch
        this._previousPitch = map.getPitch();
        map.easeTo({ pitch: 0, duration: 1000 });
        map.setMaxPitch(0);

        // delete walls and draw thicknesses
        this.#convertWallsTo2d(map);
      }
    });

    this._container.appendChild(this._btn);
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }

  #convertWallsTo3d(map) {
    // convert walls from 2d to 3d, i.e. from thicknesses to heights
    if (map.getSource("wallsSource")) {
      console.log(map.getSource("unbufferedSource"));
      let wallsData = map.getSource("wallsSource")._data;
      console.log(wallsData);

      let bufferedFeatures = map.getSource("bufferedSource")._data["features"];
      console.log(bufferedFeatures);

      // overwrite the geometries for each feature in the existing walls data
      for (let wall of wallsData["features"]) {
        // the raw buffered source data will have more features than the existing walls data, b/c the walls data will have filtered out edges where the womble cannot be calculated
        // therefore, we need to "find" the features in the raw source that correspond with our existing walls
        let bufferedFeature = bufferedFeatures.find(
          (feature) =>
            feature["properties"]["ogc_fid"] == wall["properties"]["ogc_fid"]
        );

        // console.log(bufferedFeature);
        bufferedFeature = JSON.parse(JSON.stringify(bufferedFeature)); // deep copy so we don't somehow modify raw source
        wall["geometry"] = bufferedFeature["geometry"];
      }
      console.log(wallsData);
      map.removeLayer("walls");
      map.getSource("wallsSource").setData(wallsData);
      const colors = ["#be87b9", "#dcc2dc", "#ebedec", "#b5bcd7"];
      const HEIGHT_MULTIPLIER = 5000;
      let wallsLayer = {
        id: "walls", // this needs to be unique
        type: "fill-extrusion",
        source: "wallsSource",
        paint: {
          "fill-extrusion-color": [
            "case",
            [">=", ["to-number", ["get", "womble_scaled"]], 1],
            colors[0],
            [">=", ["to-number", ["get", "womble_scaled"]], 0.6],
            colors[3],
            [">=", ["to-number", ["get", "womble_scaled"]], 0.3],
            colors[2],
            colors[1],
          ],
          "fill-extrusion-opacity": 1,

          // mapbox expression to multiply each feature's womble property with some constant to calculate the height drawn
          "fill-extrusion-height": [
            "*",
            ["get", "womble_scaled"],
            HEIGHT_MULTIPLIER,
          ],
        },
      };
      map.addLayer(wallsLayer);
    }
  }

  #convertWallsTo2d(map) {
    // convert walls from 3d to 2d, i.e. from heights to thicknesses
    if (map.getSource("wallsSource")) {
      let wallsData = map.getSource("wallsSource")._data;

      let unbufferedFeatures =
        map.getSource("unbufferedSource")._data["features"];

      // overwrite the geometries for each feature in the existing walls data
      for (let wall of wallsData["features"]) {
        // the raw source data will have more features than the existing walls data, b/c the walls data will have filtered out edges where the womble cannot be calculated
        // therefore, we need to "find" the features in the raw source that correspond with our existing walls
        let unbufferedFeature = unbufferedFeatures.find(
          (feature) =>
            feature["properties"]["ogc_fid"] == wall["properties"]["ogc_fid"]
        );

        unbufferedFeature = JSON.parse(JSON.stringify(unbufferedFeature)); // deep copy so we don't somehow modify raw source
        wall["geometry"] = unbufferedFeature["geometry"];
      }

      map.removeLayer("walls");
      map.getSource("wallsSource").setData(wallsData);
      const colors = ["#be87b9", "#dcc2dc", "#ebedec", "#b5bcd7"];
      const WIDTH_MULTIPLIER = 10;
      let wallsLayer = {
        id: "walls",
        type: "line",
        source: "wallsSource",

        layout: {
          "line-join": "miter",
        },

        paint: {
          "line-color": [
            "case",
            [">=", ["to-number", ["get", "womble_scaled"]], 1],
            colors[0],
            [">=", ["to-number", ["get", "womble_scaled"]], 0.6],
            colors[3],
            [">=", ["to-number", ["get", "womble_scaled"]], 0.3],
            colors[2],
            colors[1],
          ],
          "line-opacity": 1,

          // mapbox expression to multiply each feature's womble property with some constant to calculate the width drawn
          "line-width": ["*", ["get", "womble_scaled"], WIDTH_MULTIPLIER],
        },
      };
      map.addLayer(wallsLayer);
    }
  }
}
