import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { tutorService } from '../services/tutorService';
import { petService } from '../services/petService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { toast } from 'sonner';
import { PetResponseDto } from '../types';
import { validadorCPF } from '../lib/utils';
import Paginacao from '../components/Paginacao';
import CartaoVincularPet from '../components/CartaoVincularPet';
import ModalCriarPet from '../components/ModalCriarPet';
import { useDebounce } from '@/hooks/useDebounce';
import { Search } from 'lucide-react';

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

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<DadosFormularioTutor>();
    const [foto, setFoto] = useState<File | null>(null);
    const [carregandoForm, setCarregandoForm] = useState(false);

    const [petsDisponiveis, setPetsDisponiveis] = useState<PetResponseDto[]>([]);
    const [idsPetsVinculados, setIdsPetsVinculados] = useState<Set<number>>(new Set());
    const [pagina, setPagina] = useState(0);
    const [totalDePaginas, setTotalDePaginas] = useState(0);
    const [carregandoPets, setCarregandoPets] = useState(false);
    const [idPetEmVinculo, setIdPetEmVinculo] = useState<number | null>(null);
    const [ordenarVinculados, setOrdenarVinculados] = useState(true);

    useEffect(() => {
        if (ehModoEdicao) {
            tutorService.getById(Number(id)).then((dados: any) => {
                reset({
                    nome: dados.nome,
                    email: dados.email,
                    telefone: dados.telefone,
                    endereco: dados.endereco,
                    cpf: String(dados.cpf)
                });
                setIdDoTutor(dados.id);
                if (dados.pets) {
                    setIdsPetsVinculados(new Set(dados.pets.map((p: any) => p.id)));
                }
            });
        }
    }, [id, ehModoEdicao, reset]);

    const [nomeParaBusca, setNomeParaBusca] = useState('');
    const nomeComDebounce = useDebounce(nomeParaBusca, 500);

    useEffect(() => {
        if (etapa === 2) {
            buscarPetsParaVinculo(0);
        }
    }, [nomeComDebounce]);

    const buscarPetsParaVinculo = async (indicePagina: number) => {
        setCarregandoPets(true);
        try {
            const dados = await petService.getAll(indicePagina, 10, nomeComDebounce);
            setPetsDisponiveis(dados.content);
            setTotalDePaginas(dados.pageCount);
            setPagina(indicePagina);
        } catch (erro) {
            toast.error("Erro ao carregar lista de pets.");
        } finally {
            setCarregandoPets(false);
        }
    };

    const lidarComEtapa1 = async (dados: DadosFormularioTutor) => {
        setCarregandoForm(true);
        try {
            const payload = { ...dados, cpf: Number(dados.cpf.replace(/\D/g, '')) };
            let idTutorAtual = idDoTutor;

            if (ehModoEdicao && idTutorAtual) {
                await tutorService.update(idTutorAtual, payload);
                toast.success("Dados básicos atualizados!");
            } else {
                const novoTutor = await tutorService.create(payload);
                idTutorAtual = novoTutor.id;
                setIdDoTutor(novoTutor.id);
                toast.success("Tutor cadastrado com sucesso!");
            }

            if (foto && idTutorAtual) {
                await tutorService.uploadPhoto(idTutorAtual, foto);
            }

            //Avança para o passo de vincular pets
            setEtapa(2);
            buscarPetsParaVinculo(0);
        } catch (erro) {
            toast.error("Erro ao salvar informações do tutor.");
        } finally {
            setCarregandoForm(false);
        }
    };

    const vincularPetAoTutor = async (idDoPet: number) => {
        if (!idDoTutor) return;
        setIdPetEmVinculo(idDoPet);
        try {
            await tutorService.linkPet(idDoTutor, idDoPet);
            setIdsPetsVinculados(prev => new Set(prev).add(idDoPet));
            toast.success("Pet vinculado com sucesso!");
        } catch (erro) {
            toast.error("Erro ao vincular pet.");
        } finally {
            setIdPetEmVinculo(null);
        }
    };

    const desvincularPetAoTutor = async (idDoPet: number) => {
        if (!idDoTutor) return;
        setIdPetEmVinculo(idDoPet);
        try {
            await tutorService.unlinkPet(idDoTutor, idDoPet);
            setIdsPetsVinculados(prev => {
                const novoSet = new Set(prev);
                novoSet.delete(idDoPet);
                return novoSet;
            });
            toast.success("Pet desvinculado com sucesso!");
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

    if (etapa === 1) {
        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
                <header>
                    <h1 className="text-3xl font-display font-bold text-primary">
                        {ehModoEdicao ? 'Editar Tutor' : 'Novo Tutor'}
                    </h1>
                    <p className="text-muted-foreground text-sm">Informações de contato e endereço.</p>
                </header>

                <Card className="border-secondary/50 shadow-lg">
                    <form onSubmit={handleSubmit(lidarComEtapa1)}>
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

                                                // Máscara
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
                                        accept="image/*"
                                        onChange={(e) => setFoto(e.target.files?.[0] || null)}
                                    />
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
                            <Button type="submit" disabled={carregandoForm} className="font-bold min-w-[120px]">
                                {carregandoForm ? 'Salvando...' : 'Avançar'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        );
    }

    //ETAPA 2: Vínculo de Pets
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-primary">Vincular Pets</h1>
                    <p className="text-muted-foreground">O tutor foi salvo! Agora, selecione os pets dele.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        variant={ordenarVinculados ? "secondary" : "outline"}
                        onClick={() => setOrdenarVinculados(!ordenarVinculados)}
                        className={`font-semibold h-10 ${ordenarVinculados ? 'bg-primary/20 text-primary border-primary/20 hover:bg-primary/30' : ''}`}
                    >
                        {ordenarVinculados ? '★ Vinculados' : 'Filtrar Vinculados'}
                    </Button>

                    <div className="relative group">
                        <Input
                            placeholder="Buscar pet pelo nome..."
                            value={nomeParaBusca}
                            onChange={(e) => setNomeParaBusca(e.target.value)}
                            className="w-full md:w-[250px] pl-10 h-10"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>

                    {idDoTutor && (
                        <div className="flex items-center gap-2">
                            <ModalCriarPet
                                idDoTutor={idDoTutor}
                                aoCriarPet={(idNovoPet) => {
                                    setIdsPetsVinculados(prev => new Set(prev).add(idNovoPet));
                                    buscarPetsParaVinculo(pagina);
                                }}
                            />
                            <Button
                                variant="outline"
                                onClick={finalizarProcesso}
                                className="font-bold border-primary text-primary hover:bg-primary/5 h-10"
                            >
                                Concluir
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            {carregandoPets ? (
                <div className="p-20 text-center animate-pulse">Carregando catálogo de pets...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...petsDisponiveis].sort((a, b) => {
                        if (!ordenarVinculados) return 0;
                        const aVinculado = idsPetsVinculados.has(a.id);
                        const bVinculado = idsPetsVinculados.has(b.id);
                        if (aVinculado && !bVinculado) return -1;
                        if (!aVinculado && bVinculado) return 1;
                        return 0;
                    }).map(pet => (
                        <CartaoVincularPet
                            key={pet.id}
                            pet={pet}
                            estaVinculado={idsPetsVinculados.has(pet.id)}
                            aoVincular={vincularPetAoTutor}
                            aoDesvincular={desvincularPetAoTutor}
                            carregando={idPetEmVinculo === pet.id}
                        />
                    ))}
                </div>
            )}

            {totalDePaginas > 1 && (
                <div className="pt-6 border-t">
                    <Paginacao
                        pagina={pagina}
                        totalPaginas={totalDePaginas}
                        aoMudarPagina={buscarPetsParaVinculo}
                    />
                </div>
            )}
        </div>
    );
};

export default PaginaFormularioTutor;