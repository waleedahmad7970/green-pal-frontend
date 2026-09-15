import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token if present
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor to unwrap { success, data, message } envelope and handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error: AxiosError<{ message?: string }>) => {
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data.message || 'API Error');
    }
    return Promise.reject(error.message);
  }
);

// Named convenience wrapper (used by pages that import { api })
export const api = {
  // Auth
  login: (data: any) => apiClient.post('/users/login', data),
  register: (data: any) => apiClient.post('/users/register', data),
  getProfile: () => apiClient.get('/users/profile'),

  // Stripe & Purchases
  createPaymentIntent: (amount: number) => apiClient.post('/purchases/create-payment-intent', { amount }),
  recordPurchase: (amount: number, stripePaymentIntentId: string) =>
    apiClient.post('/purchases/record', { amount, stripePaymentIntentId }),

  // Orders
  getOrders: () => apiClient.get('/orders'),
  createOrder: (data: any) => apiClient.post('/orders', data),
  updateOrder: (id: string, data: any) => apiClient.put(`/orders/${id}`, data),
  deleteOrder: (id: string) => apiClient.delete(`/orders/${id}`),

  // Locations
  getLocations: () => apiClient.get('/locations'),
  createLocation: (data: any) => apiClient.post('/locations', data),
  updateLocation: (id: string, data: any) => apiClient.put(`/locations/${id}`, data),
  deleteLocation: (id: string) => apiClient.delete(`/locations/${id}`),

  // Invoices
  getInvoices: () => apiClient.get('/invoices'),
  createInvoice: (data: any) => apiClient.post('/invoices', data),
  updateInvoice: (id: string, data: any) => apiClient.put(`/invoices/${id}`, data),

  // Purchases (admin CRUD)
  getPurchases: () => apiClient.get('/purchases'),
  createPurchase: (data: any) => apiClient.post('/purchases', data),
  updatePurchase: (id: string, data: any) => apiClient.put(`/purchases/${id}`, data),
};

// Default export is the raw axios instance so lib/admin/api.ts can call
// apiClient.get / post / put / delete directly and get the unwrapped data.
export default apiClient;
