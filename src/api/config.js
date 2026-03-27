import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const CHAT_BASE_URL = import.meta.env.VITE_CHATBOT_API_URL

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 40000,
  headers: {
    'Content-Type': 'application/json',
  },
});
export const apiClient2 = axios.create({
  baseURL: CHAT_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle 401 errors globally
const handleAuthError = (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

apiClient.interceptors.response.use(
  (response) => response,
  handleAuthError
);

apiClient2.interceptors.response.use(
  (response) => response,
  handleAuthError
);
