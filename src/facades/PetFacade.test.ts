import { describe, it, expect, vi, beforeEach } from 'vitest';
import { petFacade } from './PetFacade';
import { petService } from '../services/petService';

vi.mock('../services/petService', () => ({
    petService: {
        getAll: vi.fn(),
        getById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        uploadPhoto: vi.fn()
    }
}));

describe('PetFacade', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve carregar pets e atualizar o BehaviorSubject', async () => {
        const mockPets = {
            content: [{ id: 1, nome: 'Rex' }],
            page: 0,
            pageCount: 1
        };

        const mockFullPet = { id: 1, nome: 'Rex', tutores: [] };

        vi.mocked(petService.getAll).mockResolvedValue(mockPets as any);
        vi.mocked(petService.getById).mockResolvedValue(mockFullPet as any);

        await petFacade.carregarPets();

        let petsResult: any[] = [];
        const sub = petFacade.pets$.subscribe(p => petsResult = p);
        expect(petsResult).toHaveLength(1);
        expect(petsResult[0].nome).toBe('Rex');
        sub.unsubscribe();

        let pagResult: any;
        const subPag = petFacade.pagination$.subscribe(p => pagResult = p);
        expect(pagResult.page).toBe(0);
        expect(pagResult.totalPages).toBe(1);
        subPag.unsubscribe();

        let loadingResult: boolean = true;
        const subLoad = petFacade.loading$.subscribe(l => loadingResult = l);
        expect(loadingResult).toBe(false);
        subLoad.unsubscribe();
    });

    it('deve gerenciar o estado de loading durante a criação', async () => {
        const novoPet = { nome: 'Thor', raca: 'Labrador', idade: 2 };

        vi.mocked(petService.create).mockResolvedValue({ id: 2, ...novoPet });
        vi.mocked(petService.getAll).mockResolvedValue({ content: [], page: 0, pageCount: 0 } as any);

        const promise = petFacade.criarPet(novoPet);

        let loadingDisparou = false;
        const sub = petFacade.loading$.subscribe(l => {
            if (l === true) loadingDisparou = true;
        });

        await promise;

        expect(loadingDisparou).toBe(true);

        let loadingFinal = true;
        const subFinal = petFacade.loading$.subscribe(l => loadingFinal = l);
        expect(loadingFinal).toBe(false);

        sub.unsubscribe();
        subFinal.unsubscribe();
    });

    it('deve lidar com erros e desligar o loading', async () => {
        vi.mocked(petService.getAll).mockRejectedValue(new Error('Falha na API'));

        try {
            await petFacade.carregarPets();
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }

        let loadingFinal = true;
        const sub = petFacade.loading$.subscribe(l => loadingFinal = l);
        expect(loadingFinal).toBe(false);
        sub.unsubscribe();
    });
});
