import { useState, useEffect, useCallback } from "react";
import { itensService, type FiltrosItens } from "./item-service";
import type { EstoqueItem } from "../model/EstoqueItem";

interface UseItensReturn {
  items: EstoqueItem[];
  total: number;
  page: number;
  loading: boolean;
  erro: string | null;
  filtros: FiltrosItens;
  setPage: (page: number) => void;
  setFiltros: (filtros: FiltrosItens) => void;
  recarregar: () => void;
}

export function useItens(limitePorPagina = 20): UseItensReturn {
  const [items, setItems] = useState<EstoqueItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [filtros, setFiltrosState] = useState<FiltrosItens>({});

  const buscar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const resultado = await itensService.listar({
        ...filtros,
        page,
        limit: limitePorPagina,
      });
      setItems(resultado.data);
      setTotal(resultado.total);
    } catch (err) {
      setErro("Erro ao carregar itens");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filtros, page, limitePorPagina]);

  useEffect(() => {
    buscar();
  }, [buscar]);

  const setFiltros = (novosFiltros: FiltrosItens) => {
    setFiltrosState(novosFiltros);
    setPage(1); // volta pra página 1 ao filtrar
  };

  return {
    items,
    total,
    page,
    loading,
    erro,
    filtros,
    setPage,
    setFiltros,
    recarregar: buscar,
  };
}
