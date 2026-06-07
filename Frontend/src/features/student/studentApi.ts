import axios from 'axios';
import { useAuthStore } from "../auth";
import { StudentDashboardStats } from './types';

const BASE_URL = import.meta.env.VITE_BASE_URL

const studentApi = axios.create({
    baseURL:`${BASE_URL}/students`,
    headers:{
        'Content-Type':"application/json"
    },
    // withCredentials: true
});

//attach token to all request
studentApi.interceptors.request.use((config)=>{
  const token = useAuthStore.getState().accessToken;

  if(token){
   config.headers = config.headers || {};
   config.headers.Authorization = `Bearer ${token}`
  }
  return config
},
(error)=> {
  return Promise.reject(error)
}
)

export const get_dashboard_stats = async (studentId: string): Promise<StudentDashboardStats> => {
  const { data } = await studentApi.get<StudentDashboardStats>(`/${studentId}/dashboard-stats`);
  return data;
}