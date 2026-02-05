import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { petFacade } from '../facades/PetFacade';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

interface DadosFormularioPet {
    nome: string;
    raca: string;
    idade: number;
}

const PaginaFormularioPet = () => {
    const { id } = useParams<{ id: string }>();
    const ehModoEdicao = !!id;
    const navegar = useNavigate();

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<DadosFormularioPet>();
    const [foto, setFoto] = useState<File | null>(null);
    const [fotoErro, setFotoErro] = useState<string | null>(null);
    const [carregandoInterno, setCarregandoInterno] = useState(false);

    //Carrega os dados se estiver editando
    useEffect(() => {
        if (ehModoEdicao) {
            petFacade.buscarPorId(Number(id)).then((dados) => {
                reset({
                    nome: dados.nome,
                    raca: dados.raca || '',
                    idade: dados.idade || 0
                });
            }).catch(() => {
                toast.error("Erro ao carregar dados do pet.");
                navegar('/pets');
            });
        }
    }, [id, ehModoEdicao, reset, navegar]);

    const salvarPet = async (dados: DadosFormularioPet) => {
        if (fotoErro) {
            toast.error("Corrija os erros no formulário antes de salvar.");
            return;
        }

        setCarregandoInterno(true);
        try {
            let idDoPet = Number(id);

            if (ehModoEdicao) {
                await petFacade.atualizarPet(idDoPet, dados, foto || undefined);
                toast.success("Informações atualizadas!");
            } else {
                const novoPet = await petFacade.criarPet(dados, foto || undefined);
                idDoPet = novoPet.id;
                toast.success("Pet cadastrado com sucesso!");
            }

            navegar(`/pets/${idDoPet}`);
        } catch (erro) {
            console.error(erro);
            toast.error("Ocorreu um erro ao salvar o pet.");
        } finally {
            setCarregandoInterno(false);
        }
    };

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

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
            <Card className="border-secondary/50 shadow-lg bg-card">
                <form onSubmit={handleSubmit(salvarPet)}>
                    <CardHeader className="border-b">
                        <CardTitle className="text-3xl font-display font-bold text-primary">
                            {ehModoEdicao ? 'Editar Registro' : 'Novo Pet'}
                        </CardTitle>
                        <p className="text-muted-foreground">Preencha os dados básicos do animal para o sistema.</p>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-8">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="nome" className="text-sm font-semibold">Nome do Pet</Label>
                                <Input
                                    id="nome"
                                    placeholder="Ex: Rex"
                                    {...register('nome', {
                                        required: 'O nome é obrigatório',
                                        onChange: (e) => {
                                            const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
                                            setValue('nome', value);
                                        }
                                    })}
                                    className={errors.nome ? "border-destructive" : ""}
                                />
                                {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="raca" className="text-sm font-semibold">Raça</Label>
                                <Input
                                    id="raca"
                                    placeholder="Ex: Golden Retriever"
                                    {...register('raca', {
                                        required: 'A raça é obrigatória',
                                        onChange: (e) => {
                                            const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
                                            setValue('raca', value);
                                        }
                                    })}
                                    className={errors.raca ? "border-destructive" : ""}
                                />
                                {errors.raca && <p className="text-xs text-destructive">{errors.raca.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="idade" className="text-sm font-semibold">Idade Aproximada</Label>
                                <Input
                                    id="idade"
                                    type="number"
                                    placeholder="0"
                                    {...register('idade', {
                                        required: 'A idade é obrigatória',
                                        min: { value: 0, message: 'Idade mínima é 0' },
                                        onChange: (e) => {
                                            let v = e.target.value;
                                            if (v.length > 3) {
                                                setValue('idade', Number(v.slice(0, 3)));
                                            }
                                        }
                                    })}
                                    className={errors.idade ? "border-destructive" : ""}
                                />
                                {errors.idade && <p className="text-xs text-destructive">{errors.idade.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="foto" className="text-sm font-semibold">Foto de Perfil</Label>
                                <Input
                                    id="foto"
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    className={`cursor-pointer ${fotoErro ? "border-destructive" : ""}`}
                                    onChange={(e) => {
                                        const arquivo = e.target.files?.[0] || null;
                                        if (validarArquivo(arquivo)) {
                                            setFoto(arquivo);
                                        } else {
                                            setFoto(null);
                                        }
                                    }}
                                />
                                {fotoErro ? (
                                    <p className="text-xs text-destructive">{fotoErro}</p>
                                ) : (
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                        Formatos aceitos: JPG, PNG. Máx 5MB.
                                    </p>
                                )}
                            </div>
                        </div>

                    </CardContent>

                    <CardFooter className="justify-end gap-3 bg-muted/20 py-4 border-t">
                        <Button type="button" variant="ghost" onClick={() => navegar(-1)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={carregandoInterno || !!fotoErro} className="font-bold px-8">
                            {carregandoInterno ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Processando...
                                </span>
                            ) : 'Confirmar e Salvar'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default PaginaFormularioPet;
