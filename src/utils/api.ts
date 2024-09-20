import axios from 'axios';

const SERVER_DOMAIN= "http://192.168.1.3:8000/"

export interface Alert {
  id: number;
  report_details: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED'; // Assuming these are the 3 enum values
  device: number;
  deployment: number;
}

export const getAlerts = async (): Promise<Alert[]> => {
  try {
    const response = await axios.get<Alert[]>( `${SERVER_DOMAIN}/api/alerts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};

export interface CreateAlertPayload {
  report_details: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  device: number;
  deployment: number;
}

export const createAlert = async (alertData: CreateAlertPayload): Promise<Alert> => {
  try {
    const response = await axios.post<Alert>(`${SERVER_DOMAIN}/api/alerts`, alertData);
    return response.data;
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};

