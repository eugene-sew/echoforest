import axios from 'axios';

// Alerts EndPoints 
// GET /api/alerts
// GET /api/alerts/:id
// POST /api/alerts
// PUT /api/alerts/:id
// DELETE /api/alerts/:id

const SERVER_DOMAIN = "http://192.168.1.3:8000/";

const api = axios.create({
  baseURL: SERVER_DOMAIN,
});

interface Alert {
  id: string;
  date: string;
  time: string;
  status: string;
  forest: string;
  latitude?: number;
  longitude?: number;
  device: string;
}

// GET /api/alerts
export async function getAlerts() {
  try {
    const response = await api.get('api/alerts/');
    return response.data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
}

// GET /api/alerts/:id
export async function getAlert(id: string) {
  try {
    const response = await api.get(`api/alerts/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching alert:', error);
    throw error;
  }
}

// POST /api/alerts
export async function createAlert(alertData: Omit<Alert, 'id' | 'date' | 'time'>) {
  try {
    const response = await api.post('api/alerts/', alertData);
    return response.data;
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
}

// PUT /api/alerts/:id
export async function updateAlert(id: string, alertData: Partial<Omit<Alert, 'id' | 'date' | 'time'>>) {
  try {
    const response = await api.put(`api/alerts/${id}/`, alertData);
    return response.data;
  } catch (error) {
    console.error('Error updating alert:', error);
    throw error;
  }
}

// DELETE /api/alerts/:id
export async function deleteAlert(id: string) {
  try {
    await api.delete(`api/alerts/${id}/`);
    return true;
  } catch (error) {
    console.error('Error deleting alert:', error);
    throw error;
  }
}


