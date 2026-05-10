import axios from 'axios';
import { useAuthStore } from '../authStore';
import { SyncUserPayload, User } from '../types';
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL


const authApi = axios.create({
    baseURL:AUTH_BASE_URL,
    headers:{
        'Content-Type':"application/json"
    },
    // withCredentials: true
});

//attach token to all request
authApi.interceptors.request.use((config)=>{
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

export const sync_user = async (payload:SyncUserPayload): Promise<User> => {
    const {data} = await authApi.post<User>("/sync-user", payload)
    return data
}

export const get_user_profile = async(): Promise<User> =>{
    const {data} = await authApi.get<User>("/profile")
    return data
}
