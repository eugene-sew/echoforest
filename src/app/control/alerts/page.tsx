"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  fetchAlertMetrics,
  fetchAlerts,
  updateAlertStatus,
  fetchTopRegions,
  fetchTrendData,
} from "@/utils/api";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { Pagination } from "@/components/dashboard/pagination";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Alert {
  id: string;
  date: string;
  time: string;
  status: string;
  forest: string;
  latitude: number;
  longitude: number;
}

interface TopRegion {
  region: string;
  alertCount: number;
}

interface TrendData {
  date: string;
  alertCount: number;
}

export default function AlertsPage() {
  const [metrics, setMetrics] = useState({ total: 0, active: 0, resolved: 0 });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [report, setReport] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 10;
  const [topRegions, setTopRegions] = useState<TopRegion[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);

  useEffect(() => {
    fetchAlertMetrics().then(setMetrics);
    fetchAlerts().then(setAlerts);
    fetchTopRegions().then(setTopRegions);
    fetchTrendData().then(setTrendData);
  }, []);

  const handleManageAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus: Alert["status"]) => {
    if (selectedAlert) {
      const result = await updateAlertStatus(
        selectedAlert.id,
        newStatus,
        report
      );
      if (result.success) {
        setAlerts(
          alerts.map((a) =>
            a.id === selectedAlert.id ? { ...a, status: newStatus } : a
          )
        );
        setIsModalOpen(false);
        setReport("");
      } else {
        // Handle error (e.g., show an error message)
        console.error("Failed to update alert status");
      }
    }
  };

  const indexOfLastAlert = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts = alerts.slice(indexOfFirstAlert, indexOfLastAlert);

  const totalPages = Math.ceil(alerts.length / alertsPerPage);

  return (
    <div className="p-8 space-y-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">Alerts Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 text-blue-500" /> Total Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-blue-600">
              {metrics.total}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 text-yellow-500" /> Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-yellow-600">
              {metrics.active}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 text-green-500" /> Resolved Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-600">
              {metrics.resolved}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="chart-section grid grid-cols-2 gap-4">
        <Card className="bg-white shadow-lg p-4">
          <CardHeader>
            <CardTitle>Top 3 Regions with Most Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer
              width="100%"
              height={300}>
              <BarChart data={topRegions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="alertCount"
                  fill="#8884d8"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg p-4">
          <CardHeader>
            <CardTitle>Alert Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer
              width="100%"
              height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="alertCount"
                  fill="#82ca9d"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="alerts-list bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Recent Alerts
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Forest</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentAlerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>{alert.date}</TableCell>
                <TableCell>{alert.time}</TableCell>
                <TableCell>
                  {alert.status === "active" && (
                    <AlertCircle className="text-yellow-500 inline mr-2" />
                  )}
                  {alert.status === "resolved" && (
                    <CheckCircle className="text-green-500 inline mr-2" />
                  )}
                  {alert.status === "false_positive" && (
                    <AlertTriangle className="text-red-500 inline mr-2" />
                  )}
                  {alert.status}
                </TableCell>
                <TableCell>{alert.forest}</TableCell>
                <TableCell>{`${alert.latitude}, ${alert.longitude}`}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                        Manage
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white text-gray-700">
                      <DialogHeader>
                        <DialogTitle>
                          Manage Alert: {selectedAlert?.id}
                        </DialogTitle>
                      </DialogHeader>
                      <Textarea
                        value={report}
                        onChange={(e) => setReport(e.target.value)}
                        placeholder="Enter report details..."
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button
                          onClick={() => handleStatusUpdate("resolved")}
                          className="bg-green-500 hover:bg-green-600">
                          Mark as Resolved
                        </Button>
                        <Button
                          onClick={() => handleStatusUpdate("false_positive")}
                          className="bg-red-500 hover:bg-red-600">
                          Mark as False Positive
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
