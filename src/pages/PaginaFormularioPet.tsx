import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { petService } from '../services/petService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardFooter } from '../components/ui/card';
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

    const { register, handleSubmit, reset, formState: { errors } } = useForm<DadosFormularioPet>();
    const [foto, setFoto] = useState<File | null>(null);
    const [carregando, setCarregando] = useState(false);

    //Carrega os dados se estiver editando
    useEffect(() => {
        if (ehModoEdicao) {
            petService.getById(Number(id)).then((dados: any) => {
                reset({
                    nome: dados.nome,
                    raca: dados.raca,
                    idade: dados.idade
                });
            }).catch(() => {
                toast.error("Erro ao carregar dados do pet.");
                navegar('/pets');
            });
        }
    }, [id, ehModoEdicao, reset, navegar]);

    const salvarPet = async (dados: DadosFormularioPet) => {
        setCarregando(true);
        try {
            let idDoPet = Number(id);

            if (ehModoEdicao) {
                await petService.update(idDoPet, dados);
                toast.success("Informações atualizadas!");
            } else {
                const novoPet = await petService.create(dados);
                idDoPet = novoPet.id;
                toast.success("Pet cadastrado com sucesso!");
            }

            if (foto) {
                await petService.uploadPhoto(idDoPet, foto);
            }

            navegar(`/pets/${idDoPet}`);
        } catch (erro) {
            console.error(erro);
            toast.error("Ocorreu um erro ao salvar o pet.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <header>
                <h1 className="text-3xl font-display font-bold text-primary">
                    {ehModoEdicao ? 'Editar Registro' : 'Novo Pet'}
                </h1>
                <p className="text-muted-foreground">Preencha os dados básicos do animal para o sistema.</p>
            </header>

            <Card className="border-secondary/50 shadow-lg bg-card">
                <form onSubmit={handleSubmit(salvarPet)}>
                    <CardContent className="space-y-6 pt-8">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="nome" className="text-sm font-semibold">Nome do Pet</Label>
                                <Input 
                                    id="nome" 
                                    placeholder="Ex: Rex" 
                                    {...register('nome', { required: 'O nome é obrigatório' })} 
                                    className={errors.nome ? "border-destructive" : ""}
                                />
                                {errors.nome && <p className="text-xs text-destructive italic">{errors.nome.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="raca" className="text-sm font-semibold">Raça</Label>
                                <Input 
                                    id="raca" 
                                    placeholder="Ex: Golden Retriever" 
                                    {...register('raca', { required: 'A raça é obrigatória' })} 
                                    className={errors.raca ? "border-destructive" : ""}
                                />
                                {errors.raca && <p className="text-xs text-destructive italic">{errors.raca.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="idade" className="text-sm font-semibold">Idade Aproximada</Label>
                                <Input 
                                    id="idade" 
                                    type="number" 
                                    placeholder="0"
                                    {...register('idade', { 
                                        required: 'A idade é obrigatória', 
                                        min: { value: 0, message: 'Idade mínima é 0' } 
                                    })} 
                                    className={errors.idade ? "border-destructive" : ""}
                                />
                                {errors.idade && <p className="text-xs text-destructive italic">{errors.idade.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="foto" className="text-sm font-semibold">Foto de Perfil</Label>
                                <Input
                                    id="foto"
                                    type="file"
                                    accept="image/*"
                                    className="cursor-pointer"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) setFoto(e.target.files[0]);
                                    }}
                                />
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                    Formatos aceitos: JPG, PNG. Máx 5MB.
                                </p>
                            </div>
                        </div>

                    </CardContent>

                    <CardFooter className="justify-end gap-3 bg-muted/20 py-4 border-t">
                        <Button type="button" variant="ghost" onClick={() => navegar(-1)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={carregando} className="font-bold px-8">
                            {carregando ? (
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
