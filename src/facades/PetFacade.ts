import { BehaviorSubject } from 'rxjs';
import { petService } from '../services/petService';
import { PetResponseDto, PagedPetResponseDto, PetRequestDto } from '../types';

class PetFacade {
    private petsSubject = new BehaviorSubject<PetResponseDto[]>([]);
    public pets$ = this.petsSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    private paginationSubject = new BehaviorSubject<{ page: number, totalPages: number, total: number }>({ page: 0, totalPages: 0, total: 0 });
    public pagination$ = this.paginationSubject.asObservable();

    async carregarPets(page = 0, size = 10, nome?: string, raca?: string) {
        this.loadingSubject.next(true);
        try {
            const data: PagedPetResponseDto = await petService.getAll(page, size, nome, raca);

            const enrichedPets = await Promise.all(
                data.content.map(async (pet) => {
                    try {
                        const fullPet = await petService.getById(pet.id);
                        return { ...pet, tutores: fullPet.tutores };
                    } catch {
                        return pet;
                    }
                })
            );

            this.petsSubject.next(enrichedPets);
            this.paginationSubject.next({
                page: Number(data.page),
                totalPages: Number(data.pageCount),
                total: Number(data.total)
            });
        } catch (error) {
            console.error('Erro ao carregar pets:', error);
            throw error;
        } finally {
            this.loadingSubject.next(false);
        }
    }

    async criarPet(dados: PetRequestDto, foto?: File) {
        this.loadingSubject.next(true);
        try {
            const novoPet = await petService.create(dados);
            if (foto) {
                await petService.uploadPhoto(novoPet.id, foto);
            }
            await this.carregarPets(this.paginationSubject.value.page);
            return novoPet;
        } catch (error) {
            console.error('Erro ao criar pet:', error);
            throw error;
        } finally {
            this.loadingSubject.next(false);
        }
    }

    async atualizarPet(id: number, dados: PetRequestDto, foto?: File) {
        this.loadingSubject.next(true);
        try {
            const petAtualizado = await petService.update(id, dados);
            if (foto) {
                await petService.uploadPhoto(id, foto);
            }
            await this.carregarPets(this.paginationSubject.value.page);
            return petAtualizado;
        } catch (error) {
            console.error('Erro ao atualizar pet:', error);
            throw error;
        } finally {
            this.loadingSubject.next(false);
        }
    }

    async excluirPet(id: number) {
        this.loadingSubject.next(true);
        try {
            await petService.delete(id);
            await this.carregarPets(this.paginationSubject.value.page);
        } catch (error) {
            console.error('Erro ao excluir pet:', error);
            throw error;
        } finally {
            this.loadingSubject.next(false);
        }
    }

    async buscarPorId(id: number) {
        return await petService.getById(id);
    }
}

export const petFacade = new PetFacade();
