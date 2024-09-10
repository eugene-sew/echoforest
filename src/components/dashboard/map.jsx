"use client";
/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars */

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const GHANA_CENTER = [7.9465, -1.0232];
const GHANA_ZOOM = 7;

// Fix for the missing icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

const Map = ({ deployments }) => {
  return (
    <MapContainer
      center={GHANA_CENTER}
      zoom={GHANA_ZOOM}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%" }}
      className="-z-0 rounded-md shadow">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {deployments.map((deployment) => (
        <Marker
          key={deployment.id}
          position={[deployment.lat, deployment.lng]}>
          <Popup>
            Device ID: {deployment.deviceId}
            <br />
            Alert Numbers: {deployment.alertNumbers.join(", ")}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
