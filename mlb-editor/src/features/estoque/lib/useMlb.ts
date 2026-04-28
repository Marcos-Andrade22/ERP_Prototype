import { useState, useEffect, useCallback } from "react";
import { mlbService, type MlbEntry, type MlbEntryInput } from "../../../shared/lib/mlb-service";

interface UseMlbProps {
  itemId: number;
}

export function useMlb({ itemId }: UseMlbProps) {
  const [mlbs, setMlbs] = useState<MlbEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await mlbService.listarPorItem(itemId);
      setMlbs(dados);
    } catch (err: unknown) {
      setError("Erro ao carregar MLBs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  const salvar = useCallback(
    async (novaLista: MlbEntryInput[]) => {
      setLoading(true);
      setError(null);
      try {
        const dados = await mlbService.salvarPorItem(itemId, novaLista);
        setMlbs(dados);
        return true;
      } catch (err: unknown) {
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

  return { mlbs, loading, error, carregar, salvar };
}
