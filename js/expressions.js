export function getColourExpression() {
  const colors = ["#fed976", "#fd8d3c", "#fc4e2a", "#e31a1c"];

  return [
    "case",
    [">", ["to-number", ["get", "womble_scaled"]], 1],
    colors[3],
    [">", ["to-number", ["get", "womble_scaled"]], 0.6],
    colors[2],
    [">", ["to-number", ["get", "womble_scaled"]], 0.3],
    colors[1],
    colors[0],
  ];
}

export function getWidthExpression() {
  // mapbox expression to use interpolation to adjust line width at different zoom levels
  // exponential function is used to create an effect where as you zoom in, the max line width increases while maintaining the min line width
  // this is done so that you can more easily distinguish line widths when zoomed in, while keeping the lines uncluttered when zoomed out
  return [
    "interpolate",
    ["linear"],
    ["zoom"],
    // at zoom lvl 12, the line width range is (1, 4]
    12,
    ["^", 4, ["get", "womble_scaled"]],
    // at zoom lvl 13, the line width range is (1, 8]
    13,
    ["^", 8, ["get", "womble_scaled"]],
    // at zoom lvl 14, the line width range is (1, 12]
    14,
    ["^", 12, ["get", "womble_scaled"]],
    // at zoom lvl 15, the line width range is (1, 16]
    15,
    ["^", 16, ["get", "womble_scaled"]],
    // at zoom lvl 16+, the line width range is (1, 20]
    16,
    ["^", 20, ["get", "womble_scaled"]],
  ];
}

export function getHeightExpression() {
  // mapbox expression to multiply each feature's womble property with some constant to calculate the height drawn
  const HEIGHT_MULTIPLIER = 5000;
  return ["*", ["get", "womble_scaled"], HEIGHT_MULTIPLIER];
}
