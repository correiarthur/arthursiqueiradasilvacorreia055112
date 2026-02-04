import api from './api';
import { AuthRequestDto, AuthResponseDto } from '../types';

export const authService = {
    login: async (username: string, password: string): Promise<AuthResponseDto> => {
        const credentials: AuthRequestDto = { username, password };
        const response = await api.post<AuthResponseDto>('/autenticacao/login', credentials);
        if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    }
};
