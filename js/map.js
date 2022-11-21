//mapbox token (taken from existing project)
const MAPBOX_TOKEN =
  "pk.eyJ1IjoibmR1bzAwMDMiLCJhIjoiY2tnNHlucmF3MHA4djJ6czNkaHRycmo1OCJ9.xfU4SWH35W5BYtJP8VnTEA";

let map = new mapboxgl.Map({
  container: "map",
  center: [16.539838, 28.967899],
  zoom: 1,
  style: "mapbox://styles/mapbox/streets-v9",
  accessToken: MAPBOX_TOKEN,
});
