import axios from 'axios';

const BACKEND_SERVER = import.meta.env.VITE_TRAVEL_BACKEND_SERVER;
const BACKEND_PORT = import.meta.env.VITE_TRAVEL_BACKEND_PORT;

const BASE_URL = `http://${BACKEND_SERVER}:${BACKEND_PORT}/api/v1`;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log(`[Mingeso-API] Instancia de Axios configurada hacia: ${BASE_URL}`);