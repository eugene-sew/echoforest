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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getDeployments, createDeployment } from "@/utils/api_deployment";
import { getDeployment } from "@/utils/api_deployment";

const MapWithNoSSR = dynamic(() => import("@/components/dashboard/map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
  
});

const mockDevices = [
  { id: "1", name: "Device 1", lat: 5.3018, lng: -1.993 },
  { id: "2", name: "Device 2", lat: 6.2049, lng: -1.6642 },
  { id: "3", name: "Device 3", lat: 5.961, lng: -1.7798 },
  { id: "4", name: "Device 4", lat: 5.4326, lng: -2.1428 },
  { id: "5", name: "Device 5", lat: 6.4557, lng: -1.9823 },
];

export default function DeployPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [latitudeFilter, setLatitudeFilter] = useState("all");
  const [devices, setDevices] = useState(mockDevices);
  const [deployments, setDeployments] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  useEffect(() => {
    setIsMounted(true);
    loadInitialDeployments();
  }, []);

  const handleDeviceSelect = async (deviceId) => {
    setSelectedDevice(deviceId);
    try {
      const deployment = await getDeployment(parseInt(deviceId));
      setLat(deployment.latitude.toString());
      setLng(deployment.longitude.toString());
      setContactNumber(deployment.contact_number);
    } catch (error) {
      console.error("Error fetching device data:", error);
      // Optionally, you can set an error state here to display to the user
    }
  };

  const handleDeploy = async () => {
    if (selectedDevice && lat && lng && contactNumber) {
      try {
        const newDeployment = await createDeployment({
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          contact_number: contactNumber,
          forest_name: "Default Forest", // You might want to add a field for this
          device: selectedDevice,
        });
        setDeployments((prevDeployments) => [...prevDeployments, newDeployment]);
        setSelectedDevice("");
        setLat("");
        setLng("");
        setContactNumber("");
        setOpen(false);
      } catch (error) {
        console.error("Failed to create deployment:", error);
        // You might want to show an error message to the user here
      }
    }
  };

  const loadInitialDeployments = async () => {
    try {
      const initialDeployments = await getDeployments();
      console.log("loadInitialDeployment", initialDeployments)
      setDeployments(initialDeployments);
    } catch (error) {
      console.error("Failed to fetch initial deployments:", error);
    }
  };

  const filteredDeployments = deployments.filter((deployment) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      deployment.device.toLowerCase().includes(searchTermLower) ||
      deployment.contact_number.includes(searchTerm) ||
      deployment.forest_name.toLowerCase().includes(searchTermLower);

    let matchesLatitude = true;
    if (latitudeFilter === "north") {
      matchesLatitude = deployment.latitude >= 7.5;
    } else if (latitudeFilter === "central") {
      matchesLatitude = deployment.latitude >= 6.5 && deployment.latitude < 7.5;
    } else if (latitudeFilter === "south") {
      matchesLatitude = deployment.latitude < 6.5;
    }

    return matchesSearch && matchesLatitude;
  });

  console.log("filteredDeployments", filteredDeployments)

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
                      value={device.id.toString()}>
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
                placeholder="Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
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
              <TableHead>Contact Numbers</TableHead>
              <TableHead>Forest Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeployments.map((deployment) => (
              <TableRow key={deployment.id}>
                <TableCell>{deployment.device}</TableCell>
                <TableCell>{deployment.latitude.toFixed(6)}</TableCell>
                <TableCell>{deployment.longitude.toFixed(6)}</TableCell>
                <TableCell>{deployment.contact_number}</TableCell>
                <TableCell>{deployment.forest_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-600">Map View</h2>
          {isMounted && <MapWithNoSSR deployments={filteredDeployments} />}
        </div>
      </div>
    </div>
  );
}
