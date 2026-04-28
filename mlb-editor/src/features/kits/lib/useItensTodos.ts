import { useState, useEffect, useCallback } from "react";
import { itensService } from "../../estoque/lib/item-service";
import type { EstoqueItem } from "../../estoque/model/EstoqueItem";

/**
 * Carrega TODOS os itens do estoque sem paginação.
 * Usado para popular dropdowns (ex: composição de kit) e cálculos de disponibilidade.
 * Expõe `recarregar()` para forcçar novo fetch após operações de baixa.
 */
export function useItensTodos() {
  const [itens, setItens] = useState<EstoqueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelado = false;
    setLoading(true);
    itensService
      .listarTodos()
      .then((data) => {
        if (!cancelado) setItens(data);
      })
      .catch(() => {
        if (!cancelado) setErro("Erro ao carregar itens para o kit.");
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });
    return () => { cancelado = true; };
  }, [tick]);

  const recarregar = useCallback(() => setTick(t => t + 1), []);

  return { itens, loading, erro, recarregar };
}
