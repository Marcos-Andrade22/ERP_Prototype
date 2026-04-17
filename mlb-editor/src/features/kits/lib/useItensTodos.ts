import { useState, useEffect } from "react";
import { itensService } from "../../estoque/lib/item-service";
import type { EstoqueItem } from "../../estoque/model/EstoqueItem";

/**
 * Carrega TODOS os itens do estoque sem paginação.
 * Usado exclusivamente para popular dropdowns (ex: composição de kit).
 */
export function useItensTodos() {
  const [itens, setItens] = useState<EstoqueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

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
  }, []);

  return { itens, loading, erro };
}
