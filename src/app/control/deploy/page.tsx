"use client";
/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars */

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchDeployments } from "@/utils/api";

// Dynamically import MapContainer
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

// Dynamically import TileLayer
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

// Dynamically import Marker
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

// Dynamically import Popup
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

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
  { id: "1", name: "Device 1", lat: 5.3018, lng: -1.993 },
  { id: "2", name: "Device 2", lat: 6.2049, lng: -1.6642 },
  { id: "3", name: "Device 3", lat: 5.961, lng: -1.7798 },
  { id: "4", name: "Device 4", lat: 5.4326, lng: -2.1428 },
  { id: "5", name: "Device 5", lat: 6.4557, lng: -1.9823 },
];
const GHANA_CENTER: LatLngExpression = [7.9465, -1.0232];
const GHANA_ZOOM = 7;

export default function DeployPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [latitudeFilter, setLatitudeFilter] = useState("all");

  useEffect(() => {
    setIsMounted(true);
    loadInitialDeployments();
  }, []);

  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [alertNumbers, setAlertNumbers] = useState<string>("");

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
    const device = devices.find((d) => d.id === deviceId);
    if (device) {
      setLat(device.lat.toString());
      setLng(device.lng.toString());
    }
  };

  const handleDeploy = () => {
    if (selectedDevice && lat && lng && alertNumbers) {
      const newDeployment: Deployment = {
        id: Date.now().toString(),
        deviceId: selectedDevice,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        alertNumbers: alertNumbers.split(",").map((num) => num.trim()),
      };
      setDeployments((prevDeployments) => [...prevDeployments, newDeployment]);
      setSelectedDevice("");
      setLat("");
      setLng("");
      setAlertNumbers("");
      setOpen(false);
    }
  };

  const loadInitialDeployments = async () => {
    try {
      const initialDeployments = await fetchDeployments();
      setDeployments(initialDeployments);
    } catch (error) {
      console.error("Failed to fetch initial deployments:", error);
      // You might want to show an error message to the user here
    }
  };

  const filteredDeployments = deployments.filter((deployment) => {
    const matchesSearch =
      deployment.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deployment.alertNumbers.some((num) => num.includes(searchTerm));

    let matchesLatitude = true;
    if (latitudeFilter === "north") {
      matchesLatitude = deployment.lat >= 7.5;
    } else if (latitudeFilter === "central") {
      matchesLatitude = deployment.lat >= 6.5 && deployment.lat < 7.5;
    } else if (latitudeFilter === "south") {
      matchesLatitude = deployment.lat < 6.5;
    }

    return matchesSearch && matchesLatitude;
  });

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-4">Device Deployment</h1>
      <div className="flex items-center justify-between space-x-4 mb-4">
        <div className="flex gap-5">
          <Input
            type="text"
            placeholder="Search by Device ID or Alert Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select
            value={latitudeFilter}
            onValueChange={setLatitudeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="north">North Ghana</SelectItem>
              <SelectItem value="central">Central Ghana</SelectItem>
              <SelectItem value="south">South Ghana</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog
          open={open}
          onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4">Deploy New Device</Button>
          </DialogTrigger>
          <DialogContent className="bg-white p-6 rounded-lg shadow-lg text-gray-700">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold mb-4">
                Deploy a Device
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select
                value={selectedDevice}
                onValueChange={handleDeviceSelect}>
                <SelectTrigger className="w-full">
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
              <Button
                onClick={handleDeploy}
                className="w-full">
                Deploy Device
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-2 gap-4">
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
            {filteredDeployments.map((deployment) => (
              <TableRow key={deployment.id}>
                <TableCell>{deployment.deviceId}</TableCell>
                <TableCell>{deployment.lat}</TableCell>
                <TableCell>{deployment.lng}</TableCell>
                <TableCell>{deployment.alertNumbers.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-600">Map View</h2>
          {isMounted && (
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
              {filteredDeployments.map((deployment) => (
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
          )}
        </div>
      </div>
    </div>
  );
}
