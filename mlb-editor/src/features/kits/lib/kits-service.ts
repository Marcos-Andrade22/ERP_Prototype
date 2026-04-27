import { api } from "../../../shared/lib/api";
import type { Kit } from "../model/Kit";

// Garante que composicao é sempre um array, independente do que a API devolver.
// Centralizado aqui para que qualquer consumidor do service (hooks, pages) já receba dados normalizados.
export function normalizarKit(kit: Kit): Kit {
  return {
    ...kit,
    composicao:
      typeof kit.composicao === "string"
        ? JSON.parse(kit.composicao)
        : Array.isArray(kit.composicao)
        ? kit.composicao
        : [],
  };
}

export const kitsService = {
  listar: async (): Promise<Kit[]> => {
    const { data } = await api.get("/kits");
    return (data as Kit[]).map(normalizarKit);
  },

  buscarPorId: async (id: string): Promise<Kit> => {
    const { data } = await api.get(`/kits/${id}`);
    return normalizarKit(data);
  },

  criar: async (kit: Omit<Kit, "id" | "valorCalculado">): Promise<Kit> => {
    const { data } = await api.post("/kits", kit);
    return normalizarKit(data);
  },

  atualizar: async (
    id: string,
    kit: Partial<Omit<Kit, "id" | "valorCalculado">>,
  ): Promise<Kit> => {
    const { data } = await api.put(`/kits/${id}`, kit);
    return normalizarKit(data);
  },

  deletar: async (id: string): Promise<void> => {
    await api.delete(`/kits/${id}`);
  },
};
