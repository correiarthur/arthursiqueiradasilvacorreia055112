import React from 'react';
import { PetResponseDto } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface PropriedadesCartaoPet {
    pet: PetResponseDto;
}

const CartaoPet: React.FC<PropriedadesCartaoPet> = ({ pet }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Link to={`/pets/${pet.id}`} className="block h-full group">
                <Card className="h-full overflow-hidden border-border bg-white/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                    <div className="aspect-square w-full overflow-hidden bg-muted/20 relative">
                        {pet.foto ? (
                            <img
                                src={pet.foto.url}
                                alt={`Foto de ${pet.nome}`}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-secondary/10">
                                <span className="text-4xl" role="img" aria-label="Patinha">🐾</span>
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
                            <span>
                                {pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
};

export default CartaoPet;