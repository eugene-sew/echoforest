"use client";
/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Battery, Wifi, AlertTriangle, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import piPic from "../../../../public/pi.png";

// Mock data for devices
interface Device {
  id: string;
  status: string;
  powerLevel: number;
  health: string;
  ipAddress: string;
  macAddress: string;
  latitude: string;
  longitude: string;
  temperature: number;
  humidity: number;
  uptime: number;
}

const mockDevices: Device[] = [
  {
    id: "DEV001",
    status: "online",
    powerLevel: 80,
    health: "Good",
    ipAddress: "192.168.1.100",
    macAddress: "00:1A:2B:3C:4D:5E",
    latitude: "40.7128",
    longitude: "-74.0060",
    temperature: 25,
    humidity: 60,
    uptime: 86400,
  },
  {
    id: "DEV002",
    status: "offline",
    powerLevel: 20,
    health: "Poor",
    ipAddress: "192.168.1.101",
    macAddress: "00:2F:3E:4D:5C:6B",
    latitude: "34.0522",
    longitude: "-118.2437",
    temperature: 28,
    humidity: 55,
    uptime: 0,
  },
  {
    id: "DEV003",
    status: "online",
    powerLevel: 60,
    health: "Fair",
    ipAddress: "192.168.1.102",
    macAddress: "00:3G:4H:5I:6J:7K",
    latitude: "51.5074",
    longitude: "-0.1278",
    temperature: 22,
    humidity: 65,
    uptime: 43200,
  },
  {
    id: "DEV004",
    status: "online",
    powerLevel: 90,
    health: "Good",
    ipAddress: "192.168.1.103",
    macAddress: "00:4L:5M:6N:7O:8P",
    latitude: "48.8566",
    longitude: "2.3522",
    temperature: 23,
    humidity: 58,
    uptime: 172800,
  },
];

// Utility function for API calls
const apiCall = async (
  endpoint: string,
  method: string = "GET",
  data: any = null
): Promise<Device[] | { success: boolean; message: string } | null> => {
  // This is a placeholder function. In a real application, you would implement
  // actual API calls here.
  console.log(`Making ${method} request to ${endpoint}`, data);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

  if (endpoint === "/devices") {
    return mockDevices;
  }

  if (endpoint === "/add-device") {
    return { success: true, message: "Device added successfully" };
  }

  return null;
};

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [newDeviceDetected, setNewDeviceDetected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const devicesPerPage = 5;

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    filterDevices();
  }, [devices, statusFilter, searchTerm]);

  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      const fetchedDevices = await apiCall("/devices");
      if (Array.isArray(fetchedDevices)) {
        setDevices(fetchedDevices);
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDevices = () => {
    let filtered = devices;

    if (statusFilter !== "all") {
      filtered = filtered.filter((device) => device.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (device) =>
          device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.ipAddress.includes(searchTerm)
      );
    }

    setFilteredDevices(filtered);
    setCurrentPage(1);
  };

  const indexOfLastDevice = currentPage * devicesPerPage;
  const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
  const currentDevices = filteredDevices.slice(
    indexOfFirstDevice,
    indexOfLastDevice
  );

  const totalPages = Math.ceil(filteredDevices.length / devicesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          variant={currentPage === i ? "default" : "outline"}
          className="mx-1">
          {i}
        </Button>
      );
    }
    return pageNumbers;
  };

  const renderBatteryIndicator = (powerLevel: number) => {
    let color = "text-green-500";
    if (powerLevel < 20) color = "text-red-500";
    else if (powerLevel < 50) color = "text-yellow-500";

    return (
      <div className="flex items-center">
        <Battery className={`mr-2 ${color}`} />
        <span>{powerLevel}%</span>
      </div>
    );
  };

  const handleAddDevice = async () => {
    setIsLoading(true);
    try {
      // Simulating device detection and API call
      await apiCall("/detect-device", "POST");
      setNewDeviceDetected(true);
    } catch (error) {
      console.error("Error detecting device:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeDeviceAddition = async () => {
    setIsLoading(true);
    try {
      // Simulating API call to add the device
      await apiCall("/add-device", "POST", {
        /* device details */
      });
      await fetchDevices(); // Refresh the device list
      setIsAddingDevice(false);
      setNewDeviceDetected(false);
    } catch (error) {
      console.error("Error adding device:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatUptime = (seconds: number): string => {
    if (seconds === 0) return "Offline";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Devices</h1>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search devices..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddingDevice(true)}>
              Add New Device
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-gray-700">
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {isLoading ? (
                <div className="text-center">
                  <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                  <p>Detecting device...</p>
                </div>
              ) : !newDeviceDetected ? (
                <div className="text-center">
                  <p className="mb-4">
                    Connect your device to the internet via ethernet cable.
                  </p>
                  <Button onClick={handleAddDevice}>
                    <Wifi className="mr-2" />
                    Detect Device
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="mb-4">New device detected!</p>
                  <Image
                    src={piPic}
                    alt="Detected Device"
                    width={60}
                    height={60}
                    className="mx-auto mb-4 animate-rotate-3d"
                  />
                  <Button onClick={completeDeviceAddition}>
                    Complete Setup
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <div className="text-center py-4">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          <p>Loading devices...</p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uptime</TableHead>
                <TableHead>MAC Address</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Power Level</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>Humidity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>{device.id}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        device.status === "online"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}>
                      {device.status}
                    </span>
                  </TableCell>
                  <TableCell>{device.macAddress}</TableCell>
                  <TableCell>{device.ipAddress}</TableCell>
                  <TableCell>{`${device.latitude}, ${device.longitude}`}</TableCell>
                  <TableCell>
                    {renderBatteryIndicator(device.powerLevel)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`flex items-center ${
                        device.health === "Good"
                          ? "text-green-500"
                          : device.health === "Fair"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}>
                      {device.health === "Good" ? (
                        <Wifi className="mr-1" />
                      ) : (
                        <AlertTriangle className="mr-1" />
                      )}
                      {device.health}
                    </span>
                  </TableCell>
                  <TableCell>{device.temperature}°C</TableCell>
                  <TableCell>{device.humidity}%</TableCell>
                  <TableCell>{formatUptime(device.uptime)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-center">{renderPagination()}</div>
        </>
      )}
    </div>
  );
}
