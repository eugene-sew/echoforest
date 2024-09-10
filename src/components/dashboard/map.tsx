"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const GHANA_CENTER: [number, number] = [7.9465, -1.0232];
const GHANA_ZOOM = 7;

interface MapProps {
  deployments: Array<{
    id: string;
    deviceId: string;
    lat: number;
    lng: number;
    alertNumbers: string[];
  }>;
}

const Map: React.FC<MapProps> = ({ deployments }) => {
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
          position={[deployment.lat, deployment.lng]}
          icon={DefaultIcon}>
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
