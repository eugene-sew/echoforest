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
