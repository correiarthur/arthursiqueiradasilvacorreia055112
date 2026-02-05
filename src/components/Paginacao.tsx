import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from './ui/pagination';

interface PropriedadesPaginacao {
    pagina: number;
    totalPaginas: number;
    aoMudarPagina: (pagina: number) => void;
}

const Paginacao: React.FC<PropriedadesPaginacao> = ({ pagina, totalPaginas, aoMudarPagina }) => {
    const gerarNumerosPaginas = () => {
        const paginas = [];
        const maximoVisivel = 5;

        if (totalPaginas <= maximoVisivel) {
            for (let i = 0; i < totalPaginas; i++) {
                paginas.push(i);
            }
        } else {
            paginas.push(0);

            if (pagina > 2) {
                paginas.push('reticencias-inicio');
            }

            const inicio = Math.max(1, pagina - 1);
            const fim = Math.min(totalPaginas - 2, pagina + 1);

            for (let i = inicio; i <= fim; i++) {
                if (!paginas.includes(i)) {
                    paginas.push(i);
                }
            }

            if (pagina < totalPaginas - 3) {
                paginas.push('reticencias-fim');
            }

            if (!paginas.includes(totalPaginas - 1)) {
                paginas.push(totalPaginas - 1);
            }
        }
        return paginas;
    };

    if (totalPaginas <= 1) return null;

    return (
        <Pagination className="mx-0 justify-start">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (pagina > 0) aoMudarPagina(pagina - 1);
                        }}
                        className={pagina <= 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>

                {gerarNumerosPaginas().map((p, i) => (
                    <PaginationItem key={i}>
                        {typeof p === 'number' ? (
                            <PaginationLink
                                href="#"
                                isActive={p === pagina}
                                onClick={(e) => {
                                    e.preventDefault();
                                    aoMudarPagina(p);
                                }}
                                className="cursor-pointer"
                            >
                                {p + 1}
                            </PaginationLink>
                        ) : (
                            <PaginationEllipsis />
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (pagina < totalPaginas - 1) aoMudarPagina(pagina + 1);
                        }}
                        className={pagina >= totalPaginas - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default Paginacao;
