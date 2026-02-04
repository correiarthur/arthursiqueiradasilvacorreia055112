import { useEffect, useState } from 'react';
import { tutorService } from '../services/tutorService';
import { ProprietarioResponseDto } from '../types';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Plus, Search, UserStar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import Paginacao from '../components/Paginacao';
import CartaoTutor from '../components/CartaoTutor';

const PaginaListaTutores = () => {
    const [tutores, setTutores] = useState<ProprietarioResponseDto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [pagina, setPagina] = useState(0);
    const [totalDePaginas, setTotalDePaginas] = useState(0);
    const [filtroNome, setFiltroNome] = useState('');
    const filtroNomeComDebounce = useDebounce(filtroNome, 500);

    const buscarTutores = async () => {
        setCarregando(true);
        try {
            //Quantidade de tutores por página
            const dados = await tutorService.getAll(pagina, 10, filtroNomeComDebounce);
            setTutores(dados.content);
            setTotalDePaginas(dados.pageCount);
        } catch (erro) {
            console.error("Erro ao buscar tutores:", erro);
        } finally {
            setCarregando(false);
        }
    };

    //Reseta para a primeira página quando o termo de busca mudar
    useEffect(() => {
        setPagina(0);
    }, [filtroNomeComDebounce]);

    //Recarrega os dados quando a página ou o termo de busca (com debounce) mudarem
    useEffect(() => {
        buscarTutores();
    }, [pagina, filtroNomeComDebounce]);



    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-primary flex items-center gap-2"><UserStar />Tutores</h1>
                    <p className="text-muted-foreground">Gerencie os proprietários de pets cadastrados.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="relative group">
                        <Input
                            placeholder="Buscar por nome..."
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                            className="w-full md:w-[300px] pl-10"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>

                    <Button asChild className="font-bold">
                        <Link to="/tutores/novo">
                            <Plus className="mr-2 h-4 w-4" /> Cadastrar Tutor
                        </Link>
                    </Button>
                </div>
            </div>

            {carregando ? (
                <div className="flex flex-col items-center justify-center p-20 space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground animate-pulse">Buscando tutores...</p>
                </div>
            ) : (
                <>
                    {tutores.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tutores.map((tutor) => (
                                <CartaoTutor key={tutor.id} tutor={tutor} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-20 border-2 border-dashed rounded-xl">
                            <p className="text-muted-foreground">Nenhum tutor encontrado com esse nome.</p>
                        </div>
                    )}
                </>
            )}

            {!carregando && totalDePaginas > 1 && (
                <div className="pt-6 border-t">
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

export default PaginaListaTutores;