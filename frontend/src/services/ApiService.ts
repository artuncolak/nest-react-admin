import axios from 'axios';

import authService from './AuthService';

const axiosInstance = axios.create({
  withCredentials: true,
});

/* Auto refreshes the token if expired */
axiosInstance.interceptors.response.use(
  (response) => response,
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { token } = await authService.refresh();
        console.log(token);
        error.response.config.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(error.response.config);
      } catch (error) {
        //window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
