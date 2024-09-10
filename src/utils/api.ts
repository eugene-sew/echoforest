import { Deployment, TopRegion, TrendData } from "../types/deployment";
import { Device } from "../types/deployment"; // Import the Device interface

const mockDeployments: Deployment[] = [
  {
    id: "1",
    deviceId: "1",
    lat: 5.3018,
    lng: -1.993,
    alertNumbers: ["123456789", "987654321"],
  },
  {
    id: "2",
    deviceId: "2",
    lat: 6.2049,
    lng: -1.6642,
    alertNumbers: ["234567890"],
  },
  {
    id: "3",
    deviceId: "3",
    lat: 5.961,
    lng: -1.7798,
    alertNumbers: ["345678901", "456789012"],
  },
];

export async function fetchDeployments(): Promise<Deployment[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // For now, return mock data
  return mockDeployments;

  // When you're ready to use a real API, you can replace the above with:
  // const response = await fetch('https://your-api-url.com/deployments');
  // return response.json();
}

//alerts

// Simulated delay to mimic network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
const mockAlerts = [
  {
    id: "1",
    date: "2023-05-01",
    time: "14:30",
    status: "active",
    forest: "Amazon",
    latitude: -3.4653,
    longitude: -62.2159,
  },
  {
    id: "2",
    date: "2023-05-02",
    time: "09:15",
    status: "resolved",
    forest: "Borneo",
    latitude: 0.9619,
    longitude: 114.5548,
  },
  {
    id: "3",
    date: "2023-05-03",
    time: "11:45",
    status: "active",
    forest: "Congo",
    latitude: -0.7264,
    longitude: 23.6564,
  },
  // Add more mock alerts as needed
];

// Mock API functions
export async function fetchAlertMetrics() {
  await delay(500); // Simulate network delay
  const active = mockAlerts.filter((a) => a.status === "active").length;
  const resolved = mockAlerts.filter((a) => a.status === "resolved").length;
  return {
    total: mockAlerts.length,
    active,
    resolved,
  };
}

export async function fetchAlerts() {
  await delay(800); // Simulate network delay
  return mockAlerts;
}

export async function updateAlertStatus(
  id: string,
  newStatus: string,
  report: string
) {
  await delay(1000); // Simulate network delay
  const alertIndex = mockAlerts.findIndex((a) => a.id === id);
  if (alertIndex !== -1) {
    mockAlerts[alertIndex] = { ...mockAlerts[alertIndex], status: newStatus };
    console.log(`Alert ${id} updated to ${newStatus}. Report: ${report}`);
    return { success: true };
  }
  return { success: false };
}

// New API functions for top regions and trend data
export async function fetchTopRegions(): Promise<TopRegion[]> {
  // Implement the API call to fetch top regions data
  // This is a placeholder implementation
  return [
    { region: "Region A", alertCount: 50 },
    { region: "Region B", alertCount: 30 },
    { region: "Region C", alertCount: 20 },
  ];
}

export async function fetchTrendData(): Promise<TrendData[]> {
  // Implement the API call to fetch trend data
  // This is a placeholder implementation
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  return last7Days.map((date) => ({
    date,
    alertCount: Math.floor(Math.random() * 50),
  }));
}

// devices
export async function fetchDevices(): Promise<Device[]> {
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
  return [
    {
      id: "DEV001",
      status: "online",
      powerLevel: 80,
      health: "Good",
      ipAddress: "192.168.1.100",
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
      temperature: 28,
      humidity: 55,
      uptime: 0,
    },
    // Add more mock devices as needed
  ];
}
