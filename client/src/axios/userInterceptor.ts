import axios from "axios";
import { config } from "../config/config";

const API_URL = config.app.BASE_URL;

const api = axios.create({
    baseURL:`${API_URL}/api/users`,
    withCredentials: true
})

api.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) =>{
        return response;
    },
    async(error) => {
        console.error('Interceptor error', error)

        return Promise.reject(error)
    }
)

export default api;