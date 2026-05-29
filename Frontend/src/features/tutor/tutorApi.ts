import axios from "axios";
import { TutorProfilePayload, TutorProfileRead, TutorProfileUpdatePayload, TutorSearchParams, TutorSearchResult } from "./types";
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

export const get_tutor_profile = async(): Promise<TutorProfileRead> =>{
    const {data} = await tutorApi.get<TutorProfileRead>("/profile")
    return data
}

export const update_tutor_profile = async(payload: TutorProfileUpdatePayload): Promise<TutorProfileRead> => {
    const {data} = await tutorApi.patch<TutorProfileRead>("/profile", payload)
    return data
}

export const get_search_tutor = async(params?: TutorSearchParams): Promise<TutorSearchResult> => {
    const {data} = await tutorApi.get<TutorSearchResult>("/search", { params })
    return data
}

export const get_tutor_by_id = async(id: string): Promise<TutorProfileRead> => {
    const {data} = await tutorApi.get<TutorProfileRead>(`/${id}`)
    return data
}