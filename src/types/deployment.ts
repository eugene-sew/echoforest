export interface Deployment {
  id: string;
  deviceId: string;
  lat: number;
  lng: number;
  alertNumbers: string[];
}

export interface TopRegion {
  region: string;
  alertCount: number;
}

export interface TrendData {
  date: string;
  alertCount: number;
}

export interface Device {
  id: string;
  status: string;
  powerLevel: number;
  health: string;
  ipAddress: string;
  temperature: number;
  humidity: number;
  uptime: number; // Add this line
}
