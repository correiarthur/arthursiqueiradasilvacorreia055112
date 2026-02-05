import { BehaviorSubject } from 'rxjs';
import { tutorService } from '../services/tutorService';
import {
    ProprietarioRequestDto,
    ProprietarioResponseDto,
    PagedProprietarioResponseDto
} from '../types';

class TutorFacade {
    private tutoresSubject = new BehaviorSubject<ProprietarioResponseDto[]>([]);
    public tutores$ = this.tutoresSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    private paginationSubject = new BehaviorSubject<{ page: number, totalPages: number, total: number }>({ page: 0, totalPages: 0, total: 0 });
    public pagination$ = this.paginationSubject.asObservable();

    async carregarTutores(page = 0, size = 10, nome?: string) {
        this.loadingSubject.next(true);
        try {
            const data: PagedProprietarioResponseDto = await tutorService.getAll(page, size, nome);
            this.tutoresSubject.next(data.content);
            this.paginationSubject.next({
                page: Number(data.page),
                totalPages: Number(data.pageCount),
                total: Number(data.total)
            });
        } catch (error) {
            console.error('Erro ao carregar tutores:', error);
            throw error;
        } finally {
            this.loadingSubject.next(false);
        }
    }

    async criarTutor(dados: ProprietarioRequestDto, foto?: File) {
        this.loadingSubject.next(true);
        try {
            const novoTutor = await tutorService.create(dados);
            if (foto) {
                await tutorService.uploadPhoto(novoTutor.id, foto);
            }
            await this.carregarTutores(this.paginationSubject.value.page);
            return novoTutor;
        } catch (error) {
            console.error('Erro ao criar tutor:', error);
            throw error;
        } finally {
            this.loadingSubject.next(false);
        }
    }

    async atualizarTutor(id: number, dados: ProprietarioRequestDto, foto?: File) {
        this.loadingSubject.next(true);
        try {
            const tutorAtualizado = await tutorService.update(id, dados);
            if (foto) {
                await tutorService.uploadPhoto(id, foto);
            }
            await this.carregarTutores(this.paginationSubject.value.page);
            return tutorAtualizado;
        } catch (error) {
            console.error('Erro ao atualizar tutor:', error);
            throw error;
        } finally {
            this.loadingSubject.next(false);
        }
    }

    async removerTutor(id: number) {
        this.loadingSubject.next(true);
        try {
            await tutorService.delete(id);
            // Recarrega a página atual para refletir a exclusão
            await this.carregarTutores(this.paginationSubject.value.page);
        } catch (error) {
            console.error('Erro ao remover tutor:', error);
            throw error;
        } finally {
            this.loadingSubject.next(false);
        }
    }

    async buscarPorId(id: number) {
        return await tutorService.getById(id);
    }

    async vincularPet(tutorId: number, petId: number) {
        await tutorService.linkPet(tutorId, petId);
    }

    async desvincularPet(tutorId: number, petId: number) {
        await tutorService.unlinkPet(tutorId, petId);
    }
}

export const tutorFacade = new TutorFacade();
