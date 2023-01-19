import { Dimensions } from "./enums.js";
import { appDimension, setDimension } from "./index.js";

export class DimensionToggle {
  constructor({ pitch }) {
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
      } else if (appDimension == Dimensions.THREE_D) {
        // switch to 2d
        setDimension(Dimensions.TWO_D);
        this._btn.className = `mapboxgl-ctrl-icon mapboxgl-ctrl-dimensiontoggle-3d`;

        // disable pitch
        this._previousPitch = map.getPitch();
        map.easeTo({ pitch: 0, duration: 1000 });
        map.setMaxPitch(0);

        // delete walls and draw thicknesses
      }
    });

    this._container.appendChild(this._btn);
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
