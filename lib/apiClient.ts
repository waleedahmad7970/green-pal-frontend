import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach JWT token to headers if present
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor to handle automatic response unwrapping and global toast notifications
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Automatically trigger success toast on mutating actions (POST, PUT, DELETE)
    if (
      ["post", "put", "delete"].includes(
        response.config.method?.toLowerCase() || "",
      )
    ) {
      const successMessage = response.data?.message || "Operation successful!";
      toast.success(successMessage);
    }

    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error: AxiosError<{ message?: string }>) => {
    // Extract exact backend error message (e.g., "Invalid email or password")
    const errorMessage =
      error.response?.data?.message || error.message || "API Error";

    // Automatically trigger error toast
    toast.error(errorMessage);

    return Promise.reject(errorMessage);
  },
);

export default apiClient;
