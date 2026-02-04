import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { petService } from '../services/petService';
import { PetResponseCompletoDto } from '../types';
import { Button } from '../components/ui/button';
import { ArrowLeft, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import CartaoTutor from '../components/CartaoTutor';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../components/ui/dialog';

const PaginaDetalhesPet = () => {
    const { id } = useParams<{ id: string }>();
    const navegar = useNavigate();
    const [pet, setPet] = useState<PetResponseCompletoDto | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [exclusaoAberta, setExclusaoAberta] = useState(false);
    const [excluindo, setExcluindo] = useState(false);

    useEffect(() => {
        if (!id) return;

        const carregarDadosDoPet = async () => {
            try {
                const dados = await petService.getById(Number(id));
                setPet(dados);
            } catch (erro) {
                toast.error("Não foi possível carregar os detalhes do pet.");
                navegar('/pets');
            } finally {
                setCarregando(false);
            }
        };

        carregarDadosDoPet();
    }, [id, navegar]);

    const confirmarExclusao = async () => {
        if (!id) return;
        setExcluindo(true);

        try {
            await petService.delete(Number(id));
            toast.success("Pet removido do sistema.");
            navegar('/pets');
        } catch (erro) {
            toast.error("Erro ao tentar excluir o pet.");
            setExclusaoAberta(false);
        } finally {
            setExcluindo(false);
        }
    };

    if (carregando) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground animate-pulse">Buscando informações...</p>
            </div>
        );
    }

    if (!pet) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Button variant="ghost" asChild className="mb-4">
                <Link to="/pets">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a Lista
                </Link>
            </Button>

            <div className="relative h-64 md:h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-border/20">
                {pet.foto ? (
                    <img
                        src={pet.foto.url}
                        alt={`Foto de ${pet.nome}`}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-secondary/30 to-primary/10 flex items-center justify-center">
                        <span className="text-8xl">🐾</span>
                    </div>
                )}

                <div className="absolute top-6 right-6 flex gap-3">
                    <Button variant="secondary" size="icon" asChild className="shadow-lg backdrop-blur-md bg-white/80">
                        <Link to={`/pets/${pet.id}/editar`}><Edit className="h-5 w-5" /></Link>
                    </Button>
                    <Dialog open={exclusaoAberta} onOpenChange={setExclusaoAberta}>
                        <DialogTrigger asChild>
                            <Button variant="destructive" size="icon" className="shadow-lg">
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-destructive">
                                    <AlertTriangle className="h-5 w-5" /> Confirmar Exclusão
                                </DialogTitle>
                                <DialogDescription>
                                    Tem certeza que deseja remover <strong>{pet.nome}</strong> permanentemente do sistema? Esta ação não poderá ser desfeita.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button variant="outline" onClick={() => setExclusaoAberta(false)}>
                                    Cancelar
                                </Button>
                                <Button variant="destructive" onClick={confirmarExclusao} disabled={excluindo}>
                                    {excluindo ? 'Excluindo...' : 'Sim, Excluir Pet'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-10 text-white">
                    <div className="flex flex-col gap-2">
                        <span className="px-3 py-1 bg-primary/20 backdrop-blur-sm border border-white/20 rounded-full text-xs font-bold w-fit uppercase tracking-wider">
                            {pet.raca}
                        </span>
                        <h1 className="text-5xl font-display font-bold">{pet.nome}</h1>
                        <p className="text-xl opacity-90 font-light italic">
                            {pet.idade === 1 ? '1 ano de idade' : `${pet.idade} anos de idade`}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">

                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-display font-bold text-primary flex items-center gap-2">
                        Ficha do Pet
                    </h2>
                    <div className="bg-card p-8 rounded-3xl shadow-sm border border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground uppercase tracking-tighter font-semibold">Espécie / Raça</p>
                            <p className="text-lg font-medium">{pet.raca || "Não informada"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground uppercase tracking-tighter font-semibold">Idade Registrada</p>
                            <p className="text-lg font-medium">{pet.idade} {pet.idade === 1 ? 'Ano' : 'Anos'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground uppercase tracking-tighter font-semibold">Código Interno</p>
                            <p className="font-mono text-primary bg-primary/5 px-2 py-1 rounded w-fit">#{pet.id}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-display font-bold text-primary">Responsáveis</h2>
                    {pet.tutores && pet.tutores.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {pet.tutores.map(tutor => (
                                <CartaoTutor key={tutor.id} tutor={tutor} />
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 text-center border-2 border-dashed border-border rounded-3xl bg-muted/20">
                            <p className="text-muted-foreground text-sm italic">
                                Este pet ainda não possui tutores vinculados.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaginaDetalhesPet;
