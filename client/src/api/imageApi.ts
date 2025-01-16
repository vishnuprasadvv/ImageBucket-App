import api from "@/axios/userInterceptor";
import { config } from "@/config/config";

const API_URL = config.app.BASE_URL;

export const uploadImages = async(formData:FormData) => {
    const response = await api.post(`${API_URL}/api/users/images/upload`, formData, {
        headers: { "Content-Type" : "multipart/form-data"}
    })
    return response.data;
}

export const deleteImage = async(id: string) => {
    const response = await api.delete(`${API_URL}/api/users/images/${id}`)
    return response.data;
}

export const getImages = async() => {
    const response = await api.get(`${API_URL}/api/users/images`);
    return response.data;
}