import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { addCountyLayer } from "../utils/countySources";

// vite.config.js ->  base: '/mapbox_geojson/'

const useMapbox = ({ mapRef, style, center, zoom, setCenter, setZoom }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
      style: style || "mapbox://styles/mapbox/dark-v10",
    });

    // Update center and zoom on map movement
    mapRef.current.on("move", () => {
      const mapCenter = mapRef.current.getCenter();
      const mapZoom = mapRef.current.getZoom();
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    mapRef.current.on("style.load", () => {
      mapRef.current.setFog({});
    });

    // When the map is loaded, add the GeoJSON sources via our utility function.
    mapRef.current.on("load", () => {
      // For Beverly Hills - Neon Pink
      addCountyLayer(
        mapRef.current,
        "BeverlyHills",
        "/data_geojson/bev_hills/openstreetmap/bev_hills_openstreetmap.geojson",
        "#FF1493" // Neon Pink
      );

      // For Culver City - Neon Green
      addCountyLayer(
        mapRef.current,
        "CulverCity",
        `${
          import.meta.env.BASE_URL
        }data_geojson/culver_city/openstreetmap/culver_city_openstreetmap.geojson`,
        "#39FF14" // Neon Green
      );

      // For Inglewood - Neon Purple
      addCountyLayer(
        mapRef.current,
        "Inglewood",
        `${
          import.meta.env.BASE_URL
        }data_geojson/inglewood/openstreetmap/inglewood_openstreetmap.geojson`,
        "#9D00FF" // Neon Purple
      );

      // For West Hollywood - Neon Orange
      addCountyLayer(
        mapRef.current,
        "WestHollywood",
        `${
          import.meta.env.BASE_URL
        }data_geojson/west_hollywood/openstreetmap/west_hollywood_openstreetmap.geojson`,
        "#FF5F1F" // Neon Orange
      );

      // For Universal City - Neon Cyan
      addCountyLayer(
        mapRef.current,
        "UniversalCity",
        `${
          import.meta.env.BASE_URL
        }data_geojson/universal_city/openstreetmap/universal_city_openstreetmaps.geojson`,
        "#02FFFF" // Neon Cyan
      );

      // For San Fernando - Neon Magenta
      addCountyLayer(
        mapRef.current,
        "SanFernando",
        `${
          import.meta.env.BASE_URL
        }data_geojson/san_fernando/openstreetmap/san_fernando_openstreetmaps.geojson`,
        "#FF00FF" // Neon Magenta
      );

      // For Marina Del Rey - Neon Turquoise
      addCountyLayer(
        mapRef.current,
        "MarinaDelRey",
        `${
          import.meta.env.BASE_URL
        }data_geojson/marina_del_rey/openstreetmap/marina_del_rey_openstreetmaps.geojson`,
        "#00FFD1" // Neon Turquoise
      );

      // For Franklin Canyon - Neon Lime
      addCountyLayer(
        mapRef.current,
        "FranklinCanyon",
        `${
          import.meta.env.BASE_URL
        }data_geojson/franklin_canyon/openstreetmap/franklin_canyon_openstreetmaps.geojson`,
        "#A4DE02" // Neon Lime
      );

      // For Santa Monica - Neon Yellow
      addCountyLayer(
        mapRef.current,
        "SantaMonica",
        `${
          import.meta.env.BASE_URL
        }data_geojson/santa_monica/openstreetmap/santa_monica_openstreetmap.geojson`,
        "#FFFF33" // Neon Yellow
      );

      // Or add a source and layer manually if needed:
      mapRef.current.addSource("SantaMonica2", {
        type: "geojson",
        data: `${
          import.meta.env.BASE_URL
        }data_geojson/santa_monica/arcgis/santa_monica_arcgis.geojson`,
      });
      mapRef.current.addLayer({
        id: "SantaMonica2-fill",
        type: "fill",
        source: "SantaMonica2",
        layout: {},
        paint: {
          "fill-color": "rgba(0, 255, 255, 0.3)",
          "fill-outline-color": "#EEEF33",
        },
      });

    }); // closing mapRef.current.on

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return mapContainerRef;
};

export default useMapbox;
