import { useEffect, useState } from 'react';
import { petService } from '../services/petService';
import { PetResponseDto } from '../types';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { PawPrint, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import Paginacao from '../components/Paginacao';
import CartaoPet from '../components/CartaoPet';

const PaginaListaPets = () => {
    const [pets, setPets] = useState<PetResponseDto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [pagina, setPagina] = useState(0);
    const [totalDePaginas, setTotalDePaginas] = useState(0);

    const [nomeParaBusca, setNomeParaBusca] = useState('');
    const nomeComDebounce = useDebounce(nomeParaBusca, 500);

    const buscarPets = async (indicePagina: number) => {
        setCarregando(true);
        try {
            const dados = await petService.getAll(indicePagina, 10, nomeComDebounce);
            setPets(dados.content);
            setTotalDePaginas(dados.pageCount);
        } catch (erro) {
            console.error("Erro ao buscar lista de pets:", erro);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        setPagina(0);
    }, [nomeComDebounce]);
    useEffect(() => {
        buscarPets(pagina);
    }, [pagina, nomeComDebounce]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-primary flex items-center gap-2"><PawPrint /> Pets</h1>
                    <p className="text-muted-foreground">Gerencie ou encontre um novo melhor amigo.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="relative group">
                        <Input
                            placeholder="Buscar pet pelo nome..."
                            value={nomeParaBusca}
                            onChange={(e) => setNomeParaBusca(e.target.value)}
                            className="w-full md:w-[300px] pl-10"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>

                    <Button asChild className="font-bold shadow-md">
                        <Link to="/pets/novo">
                            <Plus className="mr-2 h-4 w-4" /> Novo Pet
                        </Link>
                    </Button>
                </div>
            </div>

            {carregando ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-[320px] rounded-2xl bg-muted/50 animate-pulse border border-border/50" />
                    ))}
                </div>
            ) : (
                <>
                    {pets.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
                            {pets.map((pet) => (
                                <CartaoPet key={pet.id} pet={pet} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed rounded-3xl bg-muted/10">
                            <span className="text-5xl mb-4">🔍</span>
                            <h3 className="text-lg font-medium">Nenhum pet encontrado</h3>
                            <p className="text-muted-foreground">Tente ajustar os termos da sua busca.</p>
                        </div>
                    )}
                </>
            )}

            {!carregando && totalDePaginas > 1 && (
                <div className="pt-8 flex justify-center border-t">
                    <Paginacao
                        pagina={pagina}
                        totalPaginas={totalDePaginas}
                        aoMudarPagina={setPagina}
                    />
                </div>
            )}
        </div>
    );
};

export default PaginaListaPets;
