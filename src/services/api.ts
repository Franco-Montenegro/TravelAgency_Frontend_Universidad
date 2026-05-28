import axios from 'axios';
import keycloak from '../config/keycloak';

const BACKEND_SERVER = import.meta.env.VITE_TRAVEL_BACKEND_SERVER;
const BACKEND_PORT = import.meta.env.VITE_TRAVEL_BACKEND_PORT;

const BASE_URL = `http://${BACKEND_SERVER}:${BACKEND_PORT}/api/v1`;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);