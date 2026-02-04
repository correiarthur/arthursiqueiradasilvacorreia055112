
export interface AuthRequestDto {
    username: string;
    password?: string;
}

export interface AuthResponseDto {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_expires_in: number;
}

export interface AnexoResponseDto {
    id: number;
    nome: string;
    contentType: string;
    url: string;
}

export interface PetRequestDto {
    nome: string;
    raca?: string;
    idade?: number;
}

export interface PetResponseDto {
    id: number;
    nome: string;
    raca?: string;
    idade?: number;
    foto?: AnexoResponseDto;
}

export interface PetResponseCompletoDto extends PetResponseDto {
    tutores: ProprietarioResponseDto[];
}

export interface PagedPetResponseDto {
    page: number;
    size: number;
    total: number;
    pageCount: number;
    content: PetResponseDto[];
}

export interface ProprietarioRequestDto {
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    cpf?: number;
}

export interface ProprietarioResponseDto {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    cpf: number;
    foto?: AnexoResponseDto;
}

export interface ProprietarioResponseComPetsDto extends ProprietarioResponseDto {
    pets: PetResponseDto[];
}

export interface PagedProprietarioResponseDto {
    page: number;
    size: number;
    total: number;
    pageCount: number;
    content: ProprietarioResponseDto[];
}
