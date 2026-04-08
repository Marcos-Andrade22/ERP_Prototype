import { api } from "../../../shared/lib/api";

export interface FiltrosItens {
  page?: number;
  limit?: number;
  referencia?: string;
  item?: string;
  marca?: string;
  mlb?: string;
  fornecedor?: string;
  setor?: string;
  local?: string;
  situacao_ml?: string;
  material?: string;
  tipo_retentor?: string;
  versao_motor?: string;
  montadora?: string;
  sentido?: string;
  pedir?: boolean;
  revisado?: string;
}

export const itensService = {
  listar: async (filtros: FiltrosItens = {}) => {
    const { data } = await api.get("/itens", { params: filtros });
    return data;
  },

  buscarPorId: async (id: number) => {
    const { data } = await api.get(`/itens/${id}`);
    return data;
  },

  criar: async (item: Record<string, unknown>) => {
    const { data } = await api.post("/itens", item);
    return data;
  },

  atualizar: async (id: number, item: Record<string, unknown>) => {
    const { data } = await api.put(`/itens/${id}`, item);
    return data;
  },

  deletar: async (id: number) => {
    const { data } = await api.delete(`/itens/${id}`);
    return data;
  },

  importarCSV: async (arquivo: File) => {
    const formData = new FormData();
    formData.append("arquivo", arquivo);
    const { data } = await api.post("/itens/importar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};
