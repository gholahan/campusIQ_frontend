import axios from 'axios';
import { useAuthStore } from '../auth';
import type { 
  CreateSessionPayload, Session, SessionRead, 
  AcceptSessionPayload, ReviewCreate, ReviewRead 
} from "./types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const sessionApi = axios.create({
  baseURL: `${BASE_URL}/sessions`,
  headers: { 'Content-Type': 'application/json' },
});

sessionApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const create_session = async (payload: CreateSessionPayload): Promise<Session> => {
  const { data } = await sessionApi.post<Session>('/', payload);
  return data;
};

export const get_student_sessions = async (payload: Partial<Session>): Promise<SessionRead[]> => {
  const { data } = await sessionApi.get<SessionRead[]>('/student', { params: payload });
  return data;
};

export const get_tutor_sessions = async (payload: Partial<Session>): Promise<SessionRead[]> => {
  const { data } = await sessionApi.get<SessionRead[]>('/tutor', { params: payload });
  return data;
};

export const get_session = async (id: string): Promise<SessionRead> => {
  const { data } = await sessionApi.get<SessionRead>(`/${id}`);
  return data;
};

export const accept_session = async (id: string, payload: AcceptSessionPayload): Promise<SessionRead> => {
  const { data } = await sessionApi.patch<SessionRead>(`/${id}/accept`, payload);
  return data;
};

export const decline_session = async (id: string): Promise<SessionRead> => {
  const { data } = await sessionApi.patch<SessionRead>(`/${id}/decline`);
  return data;
};

export const cancel_session = async (id: string): Promise<SessionRead> => {
  const { data } = await sessionApi.patch<SessionRead>(`/${id}/cancel`);
  return data;
};

export const start_session = async (id: string): Promise<SessionRead> => {
  const { data } = await sessionApi.patch<SessionRead>(`/${id}/start`);
  return data;
};

export const end_session = async (id: string): Promise<SessionRead> => {
  const { data } = await sessionApi.patch<SessionRead>(`/${id}/end`);
  return data;
};

export const submit_review = async (id: string, payload: ReviewCreate): Promise<ReviewRead> => {
  const { data } = await sessionApi.post<ReviewRead>(`/${id}/review`, payload);
  return data;
};

export const get_review = async (id: string): Promise<ReviewRead> => {
  const { data } = await sessionApi.get<ReviewRead>(`/${id}/review`);
  return data;
};