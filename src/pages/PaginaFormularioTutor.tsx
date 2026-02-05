import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { tutorFacade } from '../facades/TutorFacade';
import { petFacade } from '../facades/PetFacade';
import { useObservable } from '../hooks/useObservable';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { validadorCPF } from '../lib/utils';
import Paginacao from '../components/Paginacao';
import CartaoVincularPet from '../components/CartaoVincularPet';
import ModalCriarPet from '../components/ModalCriarPet';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Star, PawPrint } from 'lucide-react';
import { PetResponseDto } from '../types';

interface DadosFormularioTutor {
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    cpf: string;
}

const PaginaFormularioTutor = () => {
    const { id } = useParams<{ id: string }>();
    const ehModoEdicao = !!id;
    const navegar = useNavigate();

    const [etapa, setEtapa] = useState(1);
    const [idDoTutor, setIdDoTutor] = useState<number | null>(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<DadosFormularioTutor>();
    const [foto, setFoto] = useState<File | null>(null);
    const [fotoErro, setFotoErro] = useState<string | null>(null);
    const [carregandoInterno, setCarregandoInterno] = useState(false);

    // Facade State (Catalog)
    const petsCatalogo = useObservable(petFacade.pets$, []);
    const carregandoCatalogo = useObservable(petFacade.loading$, false);
    const { page: pagina, totalPages: totalDePaginas, total } = useObservable(petFacade.pagination$, { page: 0, totalPages: 0, total: 0 });

    // Local State (Linked Pets)
    const [petsDoTutor, setPetsDoTutor] = useState<PetResponseDto[]>([]);
    const [idPetEmVinculo, setIdPetEmVinculo] = useState<number | null>(null);

    const [nomeParaBusca, setNomeParaBusca] = useState('');
    const nomeComDebounce = useDebounce(nomeParaBusca, 500);
    const [paginaLocal, setPaginaLocal] = useState(0);

    // Initial Load
    useEffect(() => {
        if (ehModoEdicao) {
            tutorFacade.buscarPorId(Number(id)).then((dados: any) => {
                reset({
                    nome: dados.nome,
                    email: dados.email,
                    telefone: dados.telefone,
                    endereco: dados.endereco,
                    cpf: String(dados.cpf)
                });
                setIdDoTutor(dados.id);
                if (dados.pets) setPetsDoTutor(dados.pets);
            });
        }
    }, [id, ehModoEdicao, reset]);

    // Reset page on search
    useEffect(() => {
        setPaginaLocal(0);
    }, [nomeComDebounce]);

    // Fetch Catalog
    useEffect(() => {
        if (etapa === 2) {
            petFacade.carregarPets(paginaLocal, 10, nomeComDebounce);
        }
    }, [etapa, paginaLocal, nomeComDebounce]);

    const validarArquivo = (arquivo: File | null) => {
        setFotoErro(null);
        if (!arquivo) return true;

        const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!tiposPermitidos.includes(arquivo.type)) {
            setFotoErro("Apenas formatos JPG e PNG são permitidos.");
            return false;
        }

        const cincoMega = 5 * 1024 * 1024;
        if (arquivo.size > cincoMega) {
            setFotoErro("O arquivo deve ter no máximo 5MB.");
            return false;
        }

        return true;
    };

    const lidarComEtapa1 = async (dados: DadosFormularioTutor) => {
        if (fotoErro) {
            toast.error("Corrija os erros no formulário antes de avançar.");
            return;
        }

        setCarregandoInterno(true);
        try {
            const payload = { ...dados, cpf: Number(dados.cpf.replace(/\D/g, '')) };
            let tutorResult;

            if (ehModoEdicao && idDoTutor) {
                tutorResult = await tutorFacade.atualizarTutor(idDoTutor, payload as any, foto || undefined);
                toast.success("Dados básicos atualizados!");
            } else {
                tutorResult = await tutorFacade.criarTutor(payload as any, foto || undefined);
                setIdDoTutor(tutorResult.id);
                toast.success("Tutor cadastrado com sucesso!");
            }

            setEtapa(2);
        } catch (erro) {
            toast.error("Erro ao salvar informações do tutor.");
        } finally {
            setCarregandoInterno(false);
        }
    };

    const vincularPetAoTutor = async (pet: PetResponseDto) => {
        if (!idDoTutor) return;
        setIdPetEmVinculo(pet.id);
        try {
            await tutorFacade.vincularPet(idDoTutor, pet.id);
            setPetsDoTutor(prev => [pet, ...prev]); // Adiciona ao início dos vinculados
            toast.success("Pet vinculado!");
        } catch (erro) {
            toast.error("Erro ao vincular pet.");
        } finally {
            setIdPetEmVinculo(null);
        }
    };

    const desvincularPetAoTutor = async (petId: number) => {
        if (!idDoTutor) return;
        setIdPetEmVinculo(petId);
        try {
            await tutorFacade.desvincularPet(idDoTutor, petId);
            setPetsDoTutor(prev => prev.filter(p => p.id !== petId));
            toast.success("Vínculo removido.");
        } catch (erro) {
            toast.error("Erro ao desvincular pet.");
        } finally {
            setIdPetEmVinculo(null);
        }
    };

    const finalizarProcesso = () => {
        toast.success("Cadastro finalizado!");
        navegar('/tutores');
    };

    // Filter catalog to hide pets already linked to THIS tutor OR owned by OTHERS
    const idsVinculados = new Set(petsDoTutor.map(p => p.id));

    // Pets que serão mostrados no catálogo: filtramos para ocultar os que já pertencem a este tutor
    const catalogoParaExibir = petsCatalogo.filter(pet => !idsVinculados.has(pet.id));

    if (etapa === 1) {
        return (
            <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
                <Card className="border-secondary/50 shadow-lg">
                    <form onSubmit={handleSubmit(lidarComEtapa1)}>
                        <CardHeader className="border-b">
                            <CardTitle className="text-3xl font-display font-bold text-primary">
                                {ehModoEdicao ? 'Editar Tutor' : 'Novo Tutor'}
                            </CardTitle>
                            <p className="text-muted-foreground text-sm">Informações de contato e endereço.</p>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="nome" className="text-sm">Nome Completo</Label>
                                <Input
                                    id="nome"
                                    {...register('nome', {
                                        required: 'O nome é obrigatório',
                                        onChange: (e) => {
                                            const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
                                            setValue('nome', value);
                                        }
                                    })}
                                />
                                {errors.nome && <span className="text-xs text-destructive">{errors.nome.message}</span>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cpf" className="text-sm">CPF</Label>
                                    <Input
                                        id="cpf"
                                        placeholder="000.000.000-00"
                                        {...register('cpf', {
                                            required: 'O CPF é obrigatório',
                                            validate: (v) => validadorCPF(v) || 'CPF inválido',
                                            onChange: (e) => {
                                                let value = e.target.value.replace(/\D/g, '');
                                                if (value.length > 11) value = value.slice(0, 11);

                                                if (value.length > 9) value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
                                                else if (value.length > 6) value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
                                                else if (value.length > 3) value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');

                                                setValue('cpf', value);
                                            }
                                        })}
                                    />
                                    {errors.cpf && <span className="text-xs text-destructive">{errors.cpf.message}</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="telefone" className="text-sm">Telefone / Celular</Label>
                                    <Input
                                        id="telefone"
                                        placeholder="(00) 00000-0000"
                                        {...register('telefone', {
                                            required: 'O telefone é obrigatório',
                                            onChange: (e) => {
                                                let value = e.target.value.replace(/\D/g, '');
                                                if (value.length > 11) value = value.slice(0, 11);

                                                if (value.length > 10) {
                                                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                                                } else if (value.length > 6) {
                                                    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                                                } else if (value.length > 2) {
                                                    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
                                                } else if (value.length > 0) {
                                                    value = value.replace(/(\d{0,2})/, '($1');
                                                }

                                                setValue('telefone', value);
                                            }
                                        })}
                                    />
                                    {errors.telefone && <span className="text-xs text-destructive">{errors.telefone.message}</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm">E-mail</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register('email', {
                                            required: 'O e-mail é obrigatório',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'E-mail inválido'
                                            }
                                        })}
                                    />
                                    {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="foto" className="text-sm">Foto de Perfil</Label>
                                    <Input
                                        id="foto"
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        className={fotoErro ? "border-destructive" : ""}
                                        onChange={(e) => {
                                            const arquivo = e.target.files?.[0] || null;
                                            if (validarArquivo(arquivo)) {
                                                setFoto(arquivo);
                                            } else {
                                                setFoto(null);
                                            }
                                        }}
                                    />
                                    {fotoErro && <span className="text-xs text-destructive">{fotoErro}</span>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endereco" className="text-sm">Endereço Completo</Label>
                                <Input id="endereco" {...register('endereco', { required: 'O endereço é obrigatório' })} />
                                {errors.endereco && <span className="text-xs text-destructive">{errors.endereco.message}</span>}
                            </div>
                        </CardContent>

                        <CardFooter className="justify-end gap-2 bg-muted/30 py-4 border-t">
                            <Button type="button" variant="ghost" onClick={() => navegar('/tutores')}>Cancelar</Button>
                            <Button type="submit" disabled={carregandoInterno || !!fotoErro} className="font-bold min-w-[120px]">
                                {carregandoInterno ? 'Salvando...' : 'Avançar'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        );
    }

    //ETAPA 2: Vínculo de Pets
    return (
        <div className="w-full animate-in fade-in slide-in-from-right-10 duration-500">
            <Card className="border-border shadow-md">
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b">
                    <div>
                        <CardTitle className="text-3xl font-display font-bold text-primary">Gerenciar Pets</CardTitle>
                        <p className="text-muted-foreground">Vincule ou remova os pets associados a este tutor.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {idDoTutor && (
                            <ModalCriarPet
                                idDoTutor={idDoTutor}
                                aoCriarPet={() => {
                                    // Re-feth tutor to get the new pet in 'Meus Pets'
                                    tutorFacade.buscarPorId(idDoTutor).then((dados: any) => {
                                        if (dados.pets) setPetsDoTutor(dados.pets);
                                    });
                                }}
                            />
                        )}
                        <Button onClick={finalizarProcesso} className="font-bold shadow-lg shadow-primary/20">
                            Finalizar e Salvar
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-12">
                    {/* SEÇÃO 1: PETS JÁ VINCULADOS */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-primary border-b pb-3">
                            <Star className="h-6 w-6 fill-primary" />
                            <h2 className="text-2xl font-bold font-display">Pets do Tutor ({petsDoTutor.length})</h2>
                        </div>

                        {petsDoTutor.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                {petsDoTutor.map(pet => (
                                    <CartaoVincularPet
                                        key={`vinculado-${pet.id}`}
                                        pet={pet}
                                        estaVinculado={true}
                                        aoVincular={() => { }}
                                        aoDesvincular={() => desvincularPetAoTutor(pet.id)}
                                        carregando={idPetEmVinculo === pet.id}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center border-2 border-dashed rounded-3xl bg-muted/5">
                                <PawPrint className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                                <p className="text-muted-foreground font-medium">Nenhum pet vinculado ainda.</p>
                                <p className="text-xs text-muted-foreground/60">Use a busca abaixo para encontrar pets para este tutor.</p>
                            </div>
                        )}
                    </section>

                    {/* SEÇÃO 2: CATÁLOGO DE DISPONÍVEIS */}
                    <section className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b">
                            <div className="flex items-center gap-3 text-primary">
                                <Search className="h-6 w-6" />
                                <h2 className="text-2xl font-bold font-display">Catálogo Geral</h2>
                            </div>

                            <div className="relative group">
                                <Input
                                    placeholder="Procurar por nome no catálogo..."
                                    value={nomeParaBusca}
                                    onChange={(e) => setNomeParaBusca(e.target.value)}
                                    className="w-full md:w-[400px] pl-12 h-12 text-base"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            </div>
                        </div>

                        {carregandoCatalogo ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="h-64 rounded-xl bg-muted/50 animate-pulse border" />
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                    {catalogoParaExibir.map(pet => (
                                        <CartaoVincularPet
                                            key={`catalogo-${pet.id}`}
                                            pet={pet}
                                            estaVinculado={idsVinculados.has(pet.id)}
                                            aoVincular={() => vincularPetAoTutor(pet)}
                                            aoDesvincular={() => desvincularPetAoTutor(pet.id)}
                                            carregando={idPetEmVinculo === pet.id}
                                        />
                                    ))}
                                </div>

                                {catalogoParaExibir.length === 0 && !carregandoCatalogo && (
                                    <div className="text-center py-16 bg-muted/5 rounded-3xl border border-dashed">
                                        <p className="text-muted-foreground font-medium">Nenhum pet disponível encontrado com este nome.</p>
                                    </div>
                                )}

                                {total > 0 && (
                                    <div className="pt-10 flex items-center justify-between border-t mt-10">
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
                            </>
                        )}
                    </section>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaginaFormularioTutor;

