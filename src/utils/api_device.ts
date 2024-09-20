import axios from 'axios';

// Device EndPoints 
// GET /api/devices
// GET /api/devices/:id
// POST /api/devices
// PUT /api/devices/:id
// DELETE /api/devices/:id


const SERVER_DOMAIN = "http://192.168.1.3:8000/";

const api = axios.create({
  baseURL: SERVER_DOMAIN,
});

interface Device {
  id: string;
  power_level: number;
  uptime: string;
  status: string;
  health: string;
  ip_address: string;
  mac_address: string;
  latitude: string;
  longitude: string;
  temperature: number;
  humidity: number;
}

// GET /api/devices
export async function getDevices(): Promise<Device[]> {
  try {
    const response = await api.get('api/devices/');
    return response.data;
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw error;
  }
}

// GET /api/devices/:id
export async function getDevice(id: string): Promise<Device> {
  try {
    const response = await api.get(`api/devices/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching device:', error);
    throw error;
  }
}

// POST /api/devices
export async function createDevice(deviceData: Omit<Device, 'id'>): Promise<Device> {
  try {
    const response = await api.post('api/devices/', deviceData);
    return response.data;
  } catch (error) {
    console.error('Error creating device:', error);
    throw error;
  }
}

// PUT /api/devices/:id
export async function updateDevice(id: string, deviceData: Partial<Omit<Device, 'id'>>): Promise<Device> {
  try {
    const response = await api.put(`api/devices/${id}/`, deviceData);
    return response.data;
  } catch (error) {
    console.error('Error updating device:', error);
    throw error;
  }
}

// DELETE /api/devices/:id
export async function deleteDevice(id: string): Promise<boolean> {
  try {
    await api.delete(`api/devices/${id}/`);
    return true;
  } catch (error) {
    console.error('Error deleting device:', error);
    throw error;
  }
}

