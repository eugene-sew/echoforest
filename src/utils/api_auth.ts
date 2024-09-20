import axios from 'axios';

const SERVER_DOMAIN = "http://192.168.1.3:8000/";

const api = axios.create({
  baseURL: SERVER_DOMAIN,
});

interface User {
  username: string;
  password: string;
  email: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

// Register a new user
export async function register(userData: User): Promise<string> {
  try {
    const response = await api.post<AuthResponse>('api/register/', userData);
    return response.data.token;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

// Login user
export async function login(credentials: LoginCredentials): Promise<string> {
  try {
    const response = await api.post<AuthResponse>('api/login/', credentials);
    return response.data.token;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

// Logout user
export async function logout(): Promise<void> {
  try {
    await api.post('api/logout/');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

// Set token for authenticated requests
export function setAuthToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Remove token
export function removeAuthToken() {
  delete api.defaults.headers.common['Authorization'];
}

