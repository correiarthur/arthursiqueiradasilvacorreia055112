import api from './api';
import {
    ProprietarioRequestDto,
    ProprietarioResponseDto,
    PagedProprietarioResponseDto,
    ProprietarioResponseComPetsDto,
    AnexoResponseDto
} from '../types';

export const tutorService = {
    getAll: async (page = 0, size = 10, nome?: string): Promise<PagedProprietarioResponseDto> => {
        const params = { page, size, nome };
        const response = await api.get<PagedProprietarioResponseDto>('/v1/tutores', { params });
        return response.data;
    },

    getById: async (id: number): Promise<ProprietarioResponseComPetsDto> => {
        const response = await api.get<ProprietarioResponseComPetsDto>(`/v1/tutores/${id}`);
        return response.data;
    },

    create: async (data: ProprietarioRequestDto): Promise<ProprietarioResponseDto> => {
        const response = await api.post<ProprietarioResponseDto>('/v1/tutores', data);
        return response.data;
    },

    update: async (id: number, data: ProprietarioRequestDto): Promise<ProprietarioResponseDto> => {
        const response = await api.put<ProprietarioResponseDto>(`/v1/tutores/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/v1/tutores/${id}`);
    },

    uploadPhoto: async (id: number, file: File): Promise<AnexoResponseDto> => {
        const formData = new FormData();
        formData.append('foto', file);
        const response = await api.post<AnexoResponseDto>(`/v1/tutores/${id}/fotos`, formData, { // Assuming endpoint exists
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Linking
    linkPet: async (tutorId: number, petId: number): Promise<void> => {
        await api.post(`/v1/tutores/${tutorId}/pets/${petId}`);
    },

    unlinkPet: async (tutorId: number, petId: number): Promise<void> => {
        await api.delete(`/v1/tutores/${tutorId}/pets/${petId}`);
    }
};
