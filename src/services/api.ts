import axios from 'axios';
import { AuthResponseDto } from '../types';

const API_URL = 'https://pet-manager-api.geia.vip';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Add Access Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response Interceptor: Handle 401 & Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                // No refresh token, force login
                isRefreshing = false;
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                // According to swagger: PUT /autenticacao/refresh with Bearer <refresh_token>
                // We must create a new axios instance to avoid infinite loop with interceptors if this fails
                const response = await axios.put<AuthResponseDto>(
                    `${API_URL}/autenticacao/refresh`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${refreshToken}` }
                    }
                );

                const { access_token, refresh_token: new_refresh_token } = response.data;

                localStorage.setItem('access_token', access_token);
                // Sometimes refresh endpoint rotates the refresh token too, sometimes not. 
                // Specifies "refresh_token" in response, so likely yes.
                if (new_refresh_token) {
                    localStorage.setItem('refresh_token', new_refresh_token);
                }

                api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

                processQueue(null, access_token);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
