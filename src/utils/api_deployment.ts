import axios from 'axios';

// Deployment EndPoints 
// GET /api/deployments
// GET /api/deployments/:id
// POST /api/deployments
// PUT /api/deployments/:id
// DELETE /api/deployments/:id

const SERVER_DOMAIN = "http://192.168.1.3:8000/";

const api = axios.create({
  baseURL: SERVER_DOMAIN,
});

interface Deployment {
  id: number;
  latitude: number;
  longitude: number;
  contact_number: string;
  forest_name: string;
  device: string;
}

// GET /api/deployments
export async function getDeployments(): Promise<Deployment[]> {
  try {
    const response = await api.get('api/deployments/');
    return response.data;
  } catch (error) {
    console.error('Error fetching deployments:', error);
    throw error;
  }
}

// GET /api/deployments/:id
export async function getDeployment(id: number): Promise<Deployment> {
  try {
    const response = await api.get(`api/deployments/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching deployment:', error);
    throw error;
  }
}

// POST /api/deployments
export async function createDeployment(deploymentData: Omit<Deployment, 'id'>): Promise<Deployment> {
  try {
    const response = await api.post('api/deployments/', deploymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating deployment:', error);
    throw error;
  }
}

// PUT /api/deployments/:id
export async function updateDeployment(id: number, deploymentData: Partial<Omit<Deployment, 'id'>>): Promise<Deployment> {
  try {
    const response = await api.put(`api/deployments/${id}/`, deploymentData);
    return response.data;
  } catch (error) {
    console.error('Error updating deployment:', error);
    throw error;
  }
}

// DELETE /api/deployments/:id
export async function deleteDeployment(id: number): Promise<boolean> {
  try {
    await api.delete(`api/deployments/${id}/`);
    return true;
  } catch (error) {
    console.error('Error deleting deployment:', error);
    throw error;
  }
}