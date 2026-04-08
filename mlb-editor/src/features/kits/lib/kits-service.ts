import { api } from "../../../shared/lib/api";

export const kitsService = {
  listar: async () => {
    const { data } = await api.get("/kits");
    return data;
  },

  buscarPorId: async (id: string) => {
    const { data } = await api.get(`/kits/${id}`);
    return data;
  },

  criar: async (kit: { nome: string; tipo: string; composicao: unknown[] }) => {
    const { data } = await api.post("/kits", kit);
    return data;
  },

  atualizar: async (
    id: string,
    kit: Partial<{ nome: string; tipo: string; composicao: unknown[] }>,
  ) => {
    const { data } = await api.put(`/kits/${id}`, kit);
    return data;
  },

  deletar: async (id: string) => {
    const { data } = await api.delete(`/kits/${id}`);
    return data;
  },
};
