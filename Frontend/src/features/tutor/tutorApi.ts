import axios from "axios";
import { TutorProfilePayload, TutorProfileRead } from "./types";
import { useAuthStore } from "../auth";
const BASE_URL = import.meta.env.VITE_BASE_URL

if (!BASE_URL) {
  throw new Error("VITE_BASE_URL is not defined");
}

const tutorApi = axios.create({
    baseURL:`${BASE_URL}/tutors`,
    headers:{
        'Content-Type':"application/json"
    },
    // withCredentials: true
});

//attach token to all request
tutorApi.interceptors.request.use((config)=>{
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


export const createTutorProfile =async(payload:TutorProfilePayload):Promise<TutorProfileRead> => {
    const {data} = await tutorApi.post("/profile", payload)
    return data
} 