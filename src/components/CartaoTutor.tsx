import React from 'react';
import { ProprietarioResponseDto } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface PropriedadesCartaoTutor {
    tutor: ProprietarioResponseDto;
}

const CartaoTutor: React.FC<PropriedadesCartaoTutor> = ({ tutor }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="h-full border-border bg-white/50 backdrop-blur-sm hover:border-primary/50 group">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-secondary/20 flex items-center justify-center shrink-0 border border-secondary">
                        {tutor.foto ? (
                            <img 
                                src={tutor.foto.url} 
                                alt={`Foto de ${tutor.nome}`} 
                                className="h-full w-full object-cover" 
                            />
                        ) : (
                            <span className="text-lg font-display font-bold text-primary">
                                {tutor.nome.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    
                    <div className="overflow-hidden">
                        <CardTitle className="text-lg text-primary truncate">
                            {tutor.nome}
                        </CardTitle>
                        <CardDescription className="truncate">
                            {tutor.email}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center text-sm text-foreground/80">
                        <span className="mr-2" role="img" aria-label="Telefone">📞</span>
                        {tutor.telefone}
                    </div>
                </CardContent>

                <CardFooter>
                    <Button 
                        asChild 
                        variant="outline" 
                        className="w-full text-primary border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors font-bold"
                    >
                        <Link to={`/tutores/${tutor.id}`}>Ver Perfil Completo</Link>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default CartaoTutor;