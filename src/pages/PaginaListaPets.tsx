import { useEffect, useState } from 'react';
import { petFacade } from '../facades/PetFacade';
import { useObservable } from '../hooks/useObservable';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Plus, Search, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import Paginacao from '../components/Paginacao';
import CartaoPet from '../components/CartaoPet';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const PaginaListaPets = () => {
    const pets = useObservable(petFacade.pets$, []);
    const carregando = useObservable(petFacade.loading$, true);
    const { page: pagina, totalPages: totalDePaginas, total } = useObservable(petFacade.pagination$, { page: 0, totalPages: 0, total: 0 });

    const [nomeParaBusca, setNomeParaBusca] = useState('');
    const nomeComDebounce = useDebounce(nomeParaBusca, 500);

    const [paginaLocal, setPaginaLocal] = useState(0);

    useEffect(() => {
        setPaginaLocal(0);
    }, [nomeComDebounce]);

    useEffect(() => {
        petFacade.carregarPets(paginaLocal, 10, nomeComDebounce);
    }, [paginaLocal, nomeComDebounce]);

    return (
        <div className="space-y-10 pb-70">
            <Card className="border-none shadow-sm w-full">
                <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-2">
                        <PawPrint className="text-primary h-5 w-5" />
                        <CardTitle className="text-xl font-bold">Pets</CardTitle>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Input
                                placeholder="Buscar por nome..."
                                value={nomeParaBusca}
                                onChange={(e) => setNomeParaBusca(e.target.value)}
                                className="w-[250px] h-10 pl-9 text-sm"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                        <Button asChild className="font-bold bg-primary hover:bg-primary-hover px-6">
                            <Link to="/pets/novo">
                                <Plus className="mr-2 h-5 w-5" /> Novo Pet
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-8">
                    {carregando ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="h-[240px] rounded-xl bg-muted/50 animate-pulse border" />
                            ))}
                        </div>
                    ) : (
                        <>
                            {pets.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-in fade-in duration-500">
                                    {pets.map((pet) => (
                                        <CartaoPet key={pet.id} pet={pet} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/5">
                                    <span className="text-4xl mb-4">🐾</span>
                                    <h3 className="text-lg font-bold">Nenhum pet encontrado</h3>
                                    <p className="text-muted-foreground text-sm">Tente ajustar os termos da sua busca.</p>
                                </div>
                            )}
                        </>
                    )}

                    {!carregando && total > 0 && (
                        <div className="pt-8 flex items-center justify-between border-t mt-8">
                            <div className="flex-1 flex justify-start">
                                {totalDePaginas > 1 && (
                                    <Paginacao
                                        pagina={paginaLocal}
                                        totalPaginas={totalDePaginas}
                                        aoMudarPagina={setPaginaLocal}
                                    />
                                )}
                            </div>
                            <div className="text-sm font-medium text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border border-border/50">
                                Total de <span className="text-primary font-bold">{total}</span> {total === 1 ? 'registro' : 'registros'}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PaginaListaPets;
