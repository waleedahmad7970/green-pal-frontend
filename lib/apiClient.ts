import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token if present
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
  }
  return config;
});

// Interceptor to parse ApiResponse correctly and handle errors gracefully
apiClient.interceptors.response.use(
  (response) => {
    // If our backend sends { success: true, data: ..., message: ... }
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data.message || 'API Error');
    }
    return Promise.reject(error.message);
  }
);

export const api = {
  // Auth
  login: (data) => apiClient.post('/users/login', data),
  register: (data) => apiClient.post('/users/register', data),
  getProfile: () => apiClient.get('/users/profile'),

  // Stripe & Purchases
  createPaymentIntent: (amount) => apiClient.post('/purchases/create-payment-intent', { amount }),
  recordPurchase: (amount, stripePaymentIntentId) => apiClient.post('/purchases/record', { amount, stripePaymentIntentId }),

  // Orders
  getOrders: () => apiClient.get('/orders'),
  createOrder: (data) => apiClient.post('/orders', data),

  // Locations
  getLocations: () => apiClient.get('/locations'),
  createLocation: (data) => apiClient.post('/locations', data),
  
  // Invoices
  getInvoices: () => apiClient.get('/invoices'),
};

export default api;
