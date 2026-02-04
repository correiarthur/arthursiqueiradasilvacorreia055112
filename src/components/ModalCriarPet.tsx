import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { petService } from '../services/petService';
import { tutorService } from '../services/tutorService';
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
    const [carregando, setCarregando] = useState(false);
    const [foto, setFoto] = useState<File | null>(null);

    const { 
        register, 
        handleSubmit, 
        reset, 
        formState: { errors } 
    } = useForm<DadosFormularioPet>();

    const lidarComEnvio = async (dados: DadosFormularioPet) => {
        setCarregando(true);
        try {
            //1. Criar o Pet
            const novoPet = await petService.create(dados);

            //2. Upload da Foto (se houver)
            if (foto) {
                await petService.uploadPhoto(novoPet.id, foto);
            }

            //3. Vincular ao Tutor
            await tutorService.linkPet(idDoTutor, novoPet.id);

            toast.success("Pet criado e vinculado com sucesso!");
            
            aoCriarPet(novoPet.id);
            setEstaAberto(false);
            reset();
            setFoto(null);
        } catch (erro) {
            console.error(erro);
            toast.error("Erro ao criar pet.");
        } finally {
            setCarregando(false);
        }
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
                            <Input id="nome" {...register('nome', { required: 'O nome é obrigatório' })} />
                            {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="raca">Raça</Label>
                            <Input id="raca" {...register('raca', { required: 'A raça é obrigatória' })} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="idade">Idade</Label>
                            <Input 
                                id="idade" 
                                type="number" 
                                {...register('idade', { required: 'A idade é obrigatória', min: 0 })} 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="foto">Foto (Opcional)</Label>
                            <Input
                                id="foto"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const arquivo = e.target.files?.[0];
                                    if (arquivo) setFoto(arquivo);
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setEstaAberto(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={carregando} className="font-bold">
                            {carregando ? 'Salvando...' : 'Salvar e Vincular'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalCriarPet;
