
/**
 * Adds a county boundary to a Mapbox map.
 *
 * @param {mapboxgl.Map} map - The Mapbox map instance.
 * @param {string} countyName - The source and layer identifier (e.g., 'BeverlyHills').
 * @param {string} geojsonPath - Path to the local GeoJSON file (should be in the public folder).
 * @param {string} neonColor - The neon color for the boundary line.
 */
export const addCountyLayer = (map, countyName, geojsonPath, neonColor) => {
  fetch(geojsonPath)
    .then((response) => response.json())
    .then((results) => {
      // Assuming the file returns an array like Nominatim responses
      if (Array.isArray(results) && results.length) {
        const geometry = results[0].geojson;
        // Wrap the geometry in a valid Feature object
        const feature = {
          type: "Feature",
          geometry: geometry,
          properties: {}, // Optionally add properties here
        };
        // Add the source
        if (map.getSource(countyName)) {
          // Optionally remove an old source first if needed
          map.removeSource(countyName);
        }
        map.addSource(countyName, {
          type: "geojson",
          data: feature,
        });
        // Add a layer to visualize the boundary
        map.addLayer({
          id: `${countyName}-boundary`,
          type: "line",
          source: countyName,
          layout: {},
          paint: {
            "line-color": neonColor,  
            "line-width": 3,
            "line-opacity": 0.9,
          },
        });
      } else {
        console.error(
          `Error: Invalid GeoJSON data for ${countyName}.`,
          results
        );
      }
    })
    .catch((error) =>
      console.error(`Error fetching GeoJSON for ${countyName}:`, error)
    );
};
