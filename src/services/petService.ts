import api from './api';
import {
    PetRequestDto,
    PetResponseDto,
    PagedPetResponseDto,
    PetResponseCompletoDto,
    AnexoResponseDto
} from '../types';

export const petService = {
    getAll: async (page = 0, size = 10, nome?: string, raca?: string): Promise<PagedPetResponseDto> => {
        const params = { page, size, nome, raca };
        const response = await api.get<PagedPetResponseDto>('/v1/pets', { params });
        return response.data;
    },

    getById: async (id: number): Promise<PetResponseCompletoDto> => {
        const response = await api.get<PetResponseCompletoDto>(`/v1/pets/${id}`);
        return response.data;
    },

    create: async (data: PetRequestDto): Promise<PetResponseDto> => {
        const response = await api.post<PetResponseDto>('/v1/pets', data);
        return response.data;
    },

    update: async (id: number, data: PetRequestDto): Promise<PetResponseDto> => {
        const response = await api.put<PetResponseDto>(`/v1/pets/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/v1/pets/${id}`);
    },

    uploadPhoto: async (id: number, file: File): Promise<AnexoResponseDto> => {
        const formData = new FormData();
        formData.append('foto', file);
        const response = await api.post<AnexoResponseDto>(`/v1/pets/${id}/fotos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
