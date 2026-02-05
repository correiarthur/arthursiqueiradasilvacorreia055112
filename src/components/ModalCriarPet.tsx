import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { petFacade } from '../facades/PetFacade';
import { tutorFacade } from '../facades/TutorFacade';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface PropriedadesModalCriarPet {
    idDoTutor: number;
    aoCriarPet: (idDoPet: number) => void;
}

interface DadosFormularioPet {
    nome: string;
    raca: string;
    idade: number;
}

const ModalCriarPet: React.FC<PropriedadesModalCriarPet> = ({ idDoTutor, aoCriarPet }) => {
    const [estaAberto, setEstaAberto] = useState(false);
    const [carregandoInterno, setCarregandoInterno] = useState(false);
    const [foto, setFoto] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<DadosFormularioPet>();

    const [fotoErro, setFotoErro] = useState<string | null>(null);

    const lidarComEnvio = async (dados: DadosFormularioPet) => {
        if (fotoErro) return;

        setCarregandoInterno(true);
        try {
            const novoPet = await petFacade.criarPet(dados, foto || undefined);
            await tutorFacade.vincularPet(idDoTutor, novoPet.id);
            toast.success("Pet criado e vinculado com sucesso!");
            aoCriarPet(novoPet.id);
            setEstaAberto(false);
            reset();
            setFoto(null);
            setFotoErro(null);
        } catch (erro) {
            console.error(erro);
            toast.error("Erro ao criar pet.");
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

    if (!estaAberto) {
        return (
            <Button
                onClick={() => setEstaAberto(true)}
                className="cursor-pointer bg-primary hover:bg-primary/80 text-primary-foreground font-bold"
            >
                + Incluir Novo Pet
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-lg rounded-xl shadow-lg border border-border p-6 animate-in fade-in zoom-in duration-200">
                <div className="mb-4">
                    <h2 className="text-2xl font-display font-bold text-primary">Novo Pet</h2>
                    <p className="text-muted-foreground">Cadastre e vincule um novo pet automaticamente.</p>
                </div>

                <form onSubmit={handleSubmit(lidarComEnvio)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome</Label>
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
                            {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="raca">Raça</Label>
                            <Input
                                id="raca"
                                {...register('raca', {
                                    required: 'A raça é obrigatória',
                                    onChange: (e) => {
                                        const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
                                        setValue('raca', value);
                                    }
                                })}
                            />
                            {errors.raca && <p className="text-xs text-destructive">{errors.raca.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="idade">Idade</Label>
                            <Input
                                id="idade"
                                type="number"
                                {...register('idade', {
                                    required: 'A idade é obrigatória',
                                    min: 0,
                                    onChange: (e) => {
                                        let v = e.target.value;
                                        if (v.length > 3) {
                                            setValue('idade', Number(v.slice(0, 3)));
                                        }
                                    }
                                })}
                            />
                            {errors.idade && <p className="text-xs text-destructive">{errors.idade.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="foto">Foto (Opcional)</Label>
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
                            {fotoErro && <p className="text-xs text-destructive">{fotoErro}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="ghost" onClick={() => {
                            setEstaAberto(false);
                            setFotoErro(null);
                            setFoto(null);
                        }}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={carregandoInterno || !!fotoErro} className="font-bold">
                            {carregandoInterno ? 'Salvando...' : 'Salvar e Vincular'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalCriarPet;
