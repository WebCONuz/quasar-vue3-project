import { defineBoot } from '#q-app/wrappers';
import axios from 'axios';
import type { AxiosInstance } from 'axios';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Base URL sozlamalar
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

  // Request yuborishdan oldin
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('quasar_to_xy_ken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    },
  );

  // Response kelganda
  api.interceptors.response.use(
    (response) => {
      if (['post', 'put', 'delete'].includes(response.config.method || '')) {
        console.log('Muvaffaqiyatli bajarildi');
      }

      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        console.log('Unauthorized - token muddati tugagan');
      }
      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    },
  );
});

export { api, axios };
