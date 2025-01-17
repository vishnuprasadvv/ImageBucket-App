import axios from "axios";
import { config } from "../config/config";
import storage from 'redux-persist/lib/storage'
import toast from "react-hot-toast";

const API_URL = config.app.BASE_URL;

const api = axios.create({
  baseURL: `${API_URL}/api/users`,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error("Interceptor error", error);

    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage === "accessToken expired") {
        console.log('accesstoken expired, logging out...')
        clearAuthPersistedData();
        toast.error('Session ended, Please login again.')
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

const clearAuthPersistedData = () => {
  try {
    // const persistKey = "persist:user";
    // localStorage.removeItem(persistKey);
    // sessionStorage.removeItem(persistKey);
    storage.removeItem('persist:user')
    console.log("Persisted auth data cleared.");
  } catch (error) {
    console.error("Error clearing persisted auth data", error);
  }
};

export default api;
