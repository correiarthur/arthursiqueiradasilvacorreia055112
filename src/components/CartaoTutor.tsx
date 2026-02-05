import React, { useState } from 'react';
import { ProprietarioResponseDto } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import { tutorFacade } from '../facades/TutorFacade';
import { toast } from 'sonner';

interface PropriedadesCartaoTutor {
    tutor: ProprietarioResponseDto;
    podeExcluir?: boolean;
}

const CartaoTutor: React.FC<PropriedadesCartaoTutor> = ({ tutor, podeExcluir = true }) => {
    const [exclusaoAberta, setExclusaoAberta] = useState(false);
    const [excluindo, setExcluindo] = useState(false);

    const confirmarExclusao = async () => {
        setExcluindo(true);
        try {
            await tutorFacade.removerTutor(tutor.id);
            toast.success(`Tutor ${tutor.nome} removido com sucesso.`);
            setExclusaoAberta(false);
        } catch (erro) {
            toast.error("Erro ao tentar excluir o tutor.");
        } finally {
            setExcluindo(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="h-full border-border bg-white/50 backdrop-blur-sm hover:border-primary/50 group">
                <CardHeader className="flex flex-row items-center gap-3 p-4">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-secondary/20 flex items-center justify-center shrink-0 border border-secondary">
                        {tutor.foto ? (
                            <img
                                src={tutor.foto.url}
                                alt={`Foto de ${tutor.nome}`}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-sm font-display font-bold text-primary">
                                {tutor.nome.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    <div className="overflow-hidden">
                        <CardTitle className="text-base text-primary truncate leading-tight">
                            {tutor.nome}
                        </CardTitle>
                        <CardDescription className="truncate text-xs">
                            {tutor.email}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                    <div className="flex items-center text-xs text-foreground/80">
                        <span className="mr-2" role="img" aria-label="Telefone">📞</span>
                        {tutor.telefone}
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 gap-2">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex-1 text-primary border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors font-bold text-xs"
                    >
                        <Link to={`/tutores/${tutor.id}`}>Ver Perfil Completo</Link>
                    </Button>

                    {podeExcluir && (
                        <Dialog open={exclusaoAberta} onOpenChange={setExclusaoAberta}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="px-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2 text-destructive">
                                        <AlertTriangle className="h-5 w-5" /> Confirmar Exclusão
                                    </DialogTitle>
                                    <DialogDescription>
                                        Tem certeza que deseja remover o tutor <strong>{tutor.nome}</strong> permanentemente do sistema? Esta ação removerá todos os vínculos com seus pets.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button variant="outline" onClick={() => setExclusaoAberta(false)} disabled={excluindo}>
                                        Cancelar
                                    </Button>
                                    <Button variant="destructive" onClick={confirmarExclusao} disabled={excluindo}>
                                        {excluindo ? 'Excluindo...' : 'Sim, Excluir Tutor'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default CartaoTutor;