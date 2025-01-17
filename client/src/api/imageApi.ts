import api from "@/axios/userInterceptor";
import { config } from "@/config/config";
import { Image } from "@/types/images";

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

export const editImage = async(id: string, data: { title?: string; imageFile?: File | null }) => {

    const formData = new FormData();
    if(data.title){
        formData.append('title', data.title)
    }
    if(data.imageFile){
        formData.append('image', data.imageFile);
    }
    try {
        const response = await api.put(
          `${API_URL}/api/users/images/${id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error updating image:", error);
        throw error;
      }
  };

export const reorderImages = async(reorderedImages : Image[]) => {
    const response = await api.post(`${API_URL}/api/users/images/reorder`, {reorderedImages});
    return response.data;
  };