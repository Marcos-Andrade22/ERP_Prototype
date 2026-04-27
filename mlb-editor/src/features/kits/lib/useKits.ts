import { useCallback, useEffect, useState } from "react";
import { kitsService } from "./kits-service";
import type { Kit } from "../model/Kit";

export function useKits() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // kitsService.listar() já retorna kits normalizados
      const data = await kitsService.listar();
      setKits(data);
    } catch {
      setError("Erro ao carregar kits");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const criar = useCallback(
    async (kit: Omit<Kit, "id" | "valorCalculado">) => {
      const novo = await kitsService.criar(kit);
      setKits((prev) => [...prev, novo]);
      return novo;
    },
    []
  );

  const atualizar = useCallback(
    async (
      id: string,
      patch: Partial<Omit<Kit, "id" | "valorCalculado">>
    ) => {
      const atualizado = await kitsService.atualizar(id, patch);
      setKits((prev) =>
        prev.map((k) => (k.id === id ? atualizado : k))
      );
      return atualizado;
    },
    []
  );

  const deletar = useCallback(async (id: string) => {
    await kitsService.deletar(id);
    setKits((prev) => prev.filter((k) => k.id !== id));
  }, []);

  return { kits, loading, error, carregar, criar, atualizar, deletar };
}
