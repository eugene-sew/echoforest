"use client";
import { useEffect, useState } from "react";
import { AlertTriangle, Battery, Router, Trees, Wifi } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardCard } from "@/components/dashboard/dashcard";
import Trend from "@/components/dashboard/trend";
import Ring from "@/components/dashboard/ring";
import Map from "@/components/dashboard/map";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchDevices, fetchDeployments } from "@/utils/api";

export default function ControlsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [deployments, setDeployments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [devicesData, deploymentsData] = await Promise.all([
          fetchDevices(),
          fetchDeployments(),
        ]);
        setDevices(devicesData);
        setDeployments(deploymentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <DashboardCard
          ci="01"
          title="Devices"
          icon={<Router className="h-4 w-4 text-muted-foreground" />}
          value={devices.length}
          description="active field devices"
          isLoading={isLoading}
        />
        <DashboardCard
          ci="1"
          title="Forest Reserves"
          icon={<Trees className="h-4 w-4 text-muted-foreground" />}
          value={deployments.length}
          description="reserves deployed in"
          isLoading={isLoading}
        />
        <Trend />
        <Ring />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="col-span-2 xl:col-span-3">
          <CardHeader>
            <CardTitle>Deployment Overview</CardTitle>
            <CardDescription>
              Geographic view and device statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex flex-col lg:flex-row">
            <div className="w-full lg:w-[70%] h-[400px] mb-4 lg:mb-0 lg:mr-4">
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <Map deployments={deployments} />
              )}
            </div>
            <div className="w-full lg:w-[30%] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2">Recent Devices</h3>
              {isLoading ? (
                <Skeleton className="w-full h-[200px]" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Health</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {devices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell>{device.id}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Wifi
                              className={`h-5 w-5 ${
                                device.status === "online"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            />
                            <Battery
                              className={`h-5 w-5 ${
                                device.powerLevel > 50
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <AlertTriangle
                            className={`h-5 w-5 ${
                              device.health === "Good"
                                ? "text-green-500"
                                : device.health === "Warning"
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
