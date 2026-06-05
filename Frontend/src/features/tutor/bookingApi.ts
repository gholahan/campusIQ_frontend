import axios from 'axios';
import { useAuthStore } from '../auth';
import type { CreateSessionPayload, Session } from './types';


const BASE_URL = import.meta.env.VITE_BASE_URL;

const bookingApi = axios.create({
  baseURL: `${BASE_URL}/sessions`,
  headers: { 'Content-Type': 'application/json' },
});

bookingApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



export const create_booking = async (payload: CreateSessionPayload): Promise<BookingRead> => {
  const { data } = await bookingApi.post<Session>('/', payload);
  return data;
};
