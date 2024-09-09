"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";

interface Device {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface Deployment {
  id: string;
  deviceId: string;
  lat: number;
  lng: number;
  alertNumbers: string[];
}

const mockDevices: Device[] = [
  { id: "1", name: "Device 1", lat: 51.505, lng: -0.09 },
  { id: "2", name: "Device 2", lat: 51.51, lng: -0.1 },
  { id: "3", name: "Device 3", lat: 51.515, lng: -0.09 },
];

export default function DeployPage() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [alertNumbers, setAlertNumbers] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeploy = () => {
    if (selectedDevice && lat && lng && alertNumbers) {
      const newDeployment: Deployment = {
        id: Date.now().toString(),
        deviceId: selectedDevice,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        alertNumbers: alertNumbers.split(",").map((num) => num.trim()),
      };
      setDeployments([...deployments, newDeployment]);
      setSelectedDevice("");
      setLat("");
      setLng("");
      setAlertNumbers("");
      setIsModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Device Deployment</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Deploy a Device</h2>
          <div className="space-y-2">
            <Select
              value={selectedDevice}
              onValueChange={setSelectedDevice}>
              <SelectTrigger>
                <SelectValue placeholder="Select a device" />
              </SelectTrigger>
              <SelectContent>
                {devices.map((device) => (
                  <SelectItem
                    key={device.id}
                    value={device.id}>
                    {device.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Alert Numbers (comma-separated)"
              value={alertNumbers}
              onChange={(e) => setAlertNumbers(e.target.value)}
            />
            <Button onClick={handleDeploy}>Deploy Device</Button>
          </div>
          <h2 className="text-xl font-semibold mt-4 mb-2">Deployments</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device ID</TableHead>
                <TableHead>Latitude</TableHead>
                <TableHead>Longitude</TableHead>
                <TableHead>Alert Numbers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deployments.map((deployment) => (
                <TableRow key={deployment.id}>
                  <TableCell>{deployment.deviceId}</TableCell>
                  <TableCell>{deployment.lat}</TableCell>
                  <TableCell>{deployment.lng}</TableCell>
                  <TableCell>{deployment.alertNumbers.join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Map View</h2>
          <MapContainer
            center={[51.505, -0.09] as LatLngExpression}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "400px", width: "100%" }}>
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
        </div>
      </div>
    </div>
  );
}
