import { PetResponseDto } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Check, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PropriedadesCartaoVincularPet {
    pet: PetResponseDto;
    estaVinculado: boolean;
    aoVincular: (idDoPet: number) => void;
    aoDesvincular: (idDoPet: number) => void;
    carregando: boolean;
}

const CartaoVincularPet: React.FC<PropriedadesCartaoVincularPet> = ({
    pet,
    estaVinculado,
    aoVincular,
    aoDesvincular,
    carregando
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="h-full overflow-hidden border-border bg-white/50 backdrop-blur-sm hover:border-primary/50 group">
                <div className="aspect-square w-full overflow-hidden bg-muted/20 relative">
                    {pet.foto ? (
                        <img
                            src={pet.foto.url}
                            alt={pet.nome}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-secondary/10">
                            <span className="text-4xl" role="img" aria-label="ícone de pet">🐾</span>
                        </div>
                    )}
                </div>

                <CardHeader>
                    <CardTitle className="text-primary group-hover:text-secondary transition-colors truncate">
                        {pet.nome}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground truncate">{pet.raca}</p>
                </CardHeader>

                <CardContent>
                    <div className="flex justify-between items-center text-sm font-medium">
                        <span>{pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}</span>
                    </div>
                </CardContent>

                <CardFooter>
                    {estaVinculado ? (
                        <div className="grid grid-cols-5 gap-2 w-full">
                            <div className="col-span-4 h-10 flex items-center justify-center bg-green-100 text-green-700 rounded-md font-bold border border-green-200">
                                <Check className="mr-2 h-5 w-5" /> Vinculado
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => aoDesvincular(pet.id)}
                                disabled={carregando}
                                className="h-10 w-full border-destructive/20 text-destructive hover:bg-destructive/10"
                                title="Desvincular pet"
                            >
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={() => aoVincular(pet.id)}
                            disabled={carregando}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                        >
                            {carregando ? 'Vinculando...' : 'Vincular'}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default CartaoVincularPet;
