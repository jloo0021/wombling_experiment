import { drawBoundary } from "./boundaries.js";
import geoJsonData from "../dummy.geojson" assert { type: "json" }; // dummy data based on liveability geojson, with some coordinates manually converted using epsg.io
// import geoJsonData from "../aus_sa1_2021_simplified.geojson" assert { type: "json" };
// import geoJsonData from "../test.geojson" assert { type: "json" };
// import geoJsonData from "../boundaries_SA1_2016.geojson" assert { type: "json" };
console.log(geoJsonData);

//mapbox token (taken from existing project)
const MAPBOX_TOKEN =
  "pk.eyJ1IjoibmR1bzAwMDMiLCJhIjoiY2tnNHlucmF3MHA4djJ6czNkaHRycmo1OCJ9.xfU4SWH35W5BYtJP8VnTEA";

let map = new mapboxgl.Map({
  container: "map",
  // center: [144.9631, -37.9631], // long lat of melb
  // center: [145.2, -37.817], // long lat of east side melb
  center: [145.0521072, -37.757202],
  zoom: 14,
  style: "mapbox://styles/mapbox/light-v11",
  accessToken: MAPBOX_TOKEN,
  pitch: 45,
  bearing: -17.6,
  antialias: true,
});

map.addControl(new mapboxgl.NavigationControl());

map.on("load", () => {
  // when map loads, do...
  drawBoundary(map, geoJsonData);
});
