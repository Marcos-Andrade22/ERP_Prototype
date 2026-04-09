import { useState, useEffect, useCallback } from "react";
import { mlbService, type MlbItem } from "./mlb-service";

interface UseMlbProps {
  itemId: number;
}

export function useMlb({ itemId }: UseMlbProps) {
  const [mlbs, setMlbs] = useState<MlbItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await mlbService.listar(itemId);
      setMlbs(dados);
    } catch (err: any) {
      setError("Erro ao carregar MLBs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  const salvar = useCallback(
    async (novaLista: Omit<MlbItem, "id">[]) => {
      setLoading(true);
      setError(null);
      try {
        const dados = await mlbService.salvar(itemId, novaLista);
        setMlbs(dados);
        return true;
      } catch (err: any) {
        setError("Erro ao salvar MLBs");
        console.error(err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [itemId],
  );

  useEffect(() => {
    if (itemId) carregar();
  }, [carregar]);

  return {
    mlbs,
    loading,
    error,
    carregar,
    salvar,
  };
}
