import React, { useRef, useEffect } from "react";


import "./Map.css";

const Map = (props) => {
  const mapRef = useRef();

  const { center, zoome } = props;

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoome,
    });

    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoome]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
