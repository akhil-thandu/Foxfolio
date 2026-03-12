import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? (window as any).__accessToken : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );
        (window as any).__accessToken = res.data.access_token;
        error.config.headers.Authorization = `Bearer ${res.data.access_token}`;
        return api(error.config);
      } catch {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
