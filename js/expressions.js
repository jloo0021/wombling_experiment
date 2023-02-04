export function getColourExpression() {
  const colors = ["#fed976", "#fd8d3c", "#fc4e2a", "#e31a1c"];

  return [
    "case",
    [">", ["to-number", ["get", "womble_scaled"]], 0.75],
    colors[3],
    [">", ["to-number", ["get", "womble_scaled"]], 0.5],
    colors[2],
    [">", ["to-number", ["get", "womble_scaled"]], 0.25],
    colors[1],
    colors[0],
  ];
}

export function getWidthExpression() {
  // mapbox expression to use interpolation to adjust line width at different zoom levels
  // exponential function is used to create an effect where as you zoom in, the max line width increases while maintaining the min line width
  // lower zoom levels also use a division expression to make the minimum thickness even smaller
  // this is done so that you can more easily distinguish line widths when zoomed in, while keeping the lines uncluttered when zoomed out
  return [
    "interpolate",
    ["linear"],
    ["zoom"],
    // line width range is (0.1, 4]
    8,
    ["/", ["^", 40, ["get", "womble_scaled"]], 10],
    // line width range is (0.125, 5]
    9,
    ["/", ["^", 40, ["get", "womble_scaled"]], 8],
    // line width range is (0.167, 6.67]
    10,
    ["/", ["^", 40, ["get", "womble_scaled"]], 6],
    // line width range is (0.25, 10]
    11,
    ["/", ["^", 40, ["get", "womble_scaled"]], 4],
    // at zoom lvl 12, the line width range is (1, 11]
    12,
    ["^", 11, ["get", "womble_scaled"]],
    // at zoom lvl 13, the line width range is (1, 12]
    13,
    ["^", 12, ["get", "womble_scaled"]],
    // at zoom lvl 14, the line width range is (1, 13]
    14,
    ["^", 13, ["get", "womble_scaled"]],
    // at zoom lvl 15, the line width range is (1, 14]
    15,
    ["^", 14, ["get", "womble_scaled"]],
    // at zoom lvl 16+, the line width range is (1, 15]
    16,
    ["^", 15, ["get", "womble_scaled"]],
  ];
}

export function getHeightExpression() {
  // mapbox expression to multiply each feature's womble property with some constant to calculate the height drawn
  const HEIGHT_MULTIPLIER = 5000;
  return ["*", ["get", "womble_scaled"], HEIGHT_MULTIPLIER];
}
