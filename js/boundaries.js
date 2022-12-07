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
 * Transforms geojson coordinates from one projection to another.
 * Uses proj4js to make the transformation
 * @param {*} sourceProjectionDef proj4js projection definition that we are tranforming from
 * @param {*} destProjectionDef proj4js projection definition that we are tranforming to
 * @param {*} geoJson
 */
function reprojectGeoJson(sourceProjectionDef, destProjectionDef, geoJson) {
  // iterate over each coordinate pair in the geojson
  turf.coordEach(
    geoJson,
    function (currentCoord, coordIndex, featureIndex, multiFeatureIndex) {
      // the current line string, i.e. an array containing 2 coordinate pairs [[x1, y1], [x2, y2]]
      let currentLine =
        geoJson.features[featureIndex].geometry.coordinates[multiFeatureIndex];

      // the index of the coordinate pair we're currently looking at (within the current line)
      let lineCoordIndex = currentLine.findIndex((coord) => {
        return coord == currentCoord;
      });

      // transform the current coordinates to wgs84 and overwrite the corresponding coordinates in the geojson source data
      currentLine[lineCoordIndex] = proj4(
        sourceProjectionDef,
        destProjectionDef,
        currentCoord
      );
    }
  );
  return geoJson;
}

/**
 * Processes the source data so that it can be drawn using mapbox API
 */
function processData(sourceData) {
  // define the EPSG:7845 CRS. This is taken from https://epsg.io/7845. The projection can now be referenced using proj4("EPSG:7845")
  proj4.defs(
    "EPSG:7845",
    "+proj=lcc +lat_0=0 +lon_0=134 +lat_1=-18 +lat_2=-36 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
  );

  sourceData = reprojectGeoJson(
    proj4("EPSG:7845"),
    proj4("EPSG:4326"),
    sourceData
  );

  const HEIGHT_MULTIPLIER = 5000; // used to determine the height of the boundary based on womble value

  // iterates over each set of properties and calculates the a feature's boundary height
  // this assumes each feature has a womble_scaled property
  turf.propEach(sourceData, function (currentProperties, featureIndex) {
    if (currentProperties.hasOwnProperty("womble_scaled")) {
      currentProperties.height =
        currentProperties.womble_scaled * HEIGHT_MULTIPLIER;
    } else {
      // THIS IS JUST TO TEST DATA THAT HAS NO WOMBLE VALUE. TODO: DELETE LATER
      currentProperties.height = Math.random() * HEIGHT_MULTIPLIER;
    }
  });

  return turf.buffer(sourceData, 0.01, { units: "meters" }); // turns lines into polygons that can be extruded
}

/**
 * Draws a boundary between two areas on the map
 * @param {*} map
 */
export function drawBoundary(map, sourceData) {
  // map is the mapbox map object that we're working on

  console.log("drawBoundary called");

  // source defines the data to be drawn
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

  console.log(source.data);
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
      // "fill-extrusion-height": ["get", "height"],
      "fill-extrusion-height": 1000,
      // "fill-extrusion-height": ["get", "womble_scaled"], // need to somehow "get" this property and then manipulate it to create a scaled height0
      "fill-extrusion-opacity": 1,
    },
  };

  map.addLayer(boundary);
}
