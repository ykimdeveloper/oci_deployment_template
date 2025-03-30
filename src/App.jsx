import { useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import useMapbox from "./hooks/useMapbox";

const INITIAL_CENTER = [-118.4437, 34.0822];
const INITIAL_ZOOM = 10.12;

function App() {
  const mapRef = useRef();

  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);

  const handleButtonClick = () => {
    mapRef.current.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });
  };

  // Pass setCenter and setZoom so the hook can update state during map movements
  const mapContainerRef = useMapbox({
    mapRef,
    style: "mapbox://styles/mapbox/dark-v10", // dark style enhances neon effects
    center: INITIAL_CENTER, // Los Angeles center
    zoom: INITIAL_ZOOM,
    setCenter,
    setZoom,
  });

  return (
    <>
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
        Zoom: {zoom.toFixed(2)}
      </div>
      <button className="reset-button" onClick={handleButtonClick}>
        Reset
      </button>
      <div
        id="map-container"
        ref={mapContainerRef}
        style={{ width: "100%", height: "100%" }}
      />
    </>
  );
}

export default App;
