import React from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropriedadesPaginacao {
    pagina: number;
    totalPaginas: number;
    aoMudarPagina: (pagina: number) => void;
}

const Paginacao: React.FC<PropriedadesPaginacao> = ({ pagina, totalPaginas, aoMudarPagina }) => {

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <Button
                variant="outline"
                size="icon"
                onClick={() => aoMudarPagina(pagina - 1)}
                disabled={pagina <= 0}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-foreground">
                Página {pagina + 1} de {totalPaginas || 1}
            </span>
            <Button
                variant="outline"
                size="icon"
                onClick={() => aoMudarPagina(pagina + 1)}
                disabled={pagina >= totalPaginas - 1}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default Paginacao;
