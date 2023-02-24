# wombling_experiment

Multiviz Wombling Project
https://jloo0021.github.io/wombling_experiment/

This is a web app designed to explore the efficacy of the wombling technique in urban data analysis. Wombling is a boundary analysis technique used to identify and analyse differences between neighbouring areas. This app uses the Mapbox API to visualise the wombling data.

How to use the app:

1. Select the area type for your data (currently supports SA1 2011 and SA1 2016 for Melbourne)
2. Upload a .csv file containing your data. The first column must be filled with area code IDs and all other columns should contain variable data associated with that area. Each column should also have a header for the variable name.
3. Select the variables you would like to use in the wombling calculation and adjust the weights of the variables if you'd like.
4. Press "Run" to run the wombling calculation.
5. Optionally adjust the view using the various settings.
6. Click on walls and areas to view popups for more information.

Wombling calculation:

Each individual edge has their womble value calculated using the following algorithm (pseudocode), where area 1 and area 2 are the two adjacent areas to the edge:
womble = 0
for i = 0 to number of variables
  womble += (variable_i's weight * abs(area 1's variable_i - area 2's variable_i))

If the user chooses to include distance weighting, then we use the following algorithm instead:
womble = 0
for i = 0 to number of variables
  womble += (variable_i's weight * abs(area 1's variable_i - area 2's variable_i) / distance between area 1 and area 2's centroids)
  
Boundaries files:

This app requires pre-processed boundaries files to work, where the file is a feature collection containing every single edge in the region. Each available area type requires an unbuffered and a buffered geojson source file. The unbuffered file is a geojson of MultiLineString and LineString features, while the buffered file is a geojson of MultiPolygon and Polygon features.
This is related to the 2D and 3D modes functionality and the limitations of the Mapbox API. 2D mode uses the unbuffered file as the source and 3D mode uses the buffered file as the source. This is because you cannot draw vertical heights on line features in Mapbox, so, as a workaround, we use the fill-extrusion layer type to draw the walls in 3D, which only works on a polygon source.
Each area type also requires a geojson file that contains the polygons for each area, as this is related to the area popup functionality.

The boundaries files were created using the scripts in the following repository: https://github.com/jloo0021/reproject_geojson
