import { api } from "../../../shared/lib/api";

export interface MlbItem {
  id: string;
  valor: string;
  ean: boolean;
  cubagem: boolean;
  otimizado: boolean;
  full: boolean;
  patrocinados: boolean;
  clipe: boolean;
  revisado: boolean;
}

export const mlbService = {
  listar: async (itemId: number): Promise<MlbItem[]> => {
    const { data } = await api.get(`/itens/${itemId}/mlb`);
    return data;
  },

  salvar: async (
    itemId: number,
    mlbs: Omit<MlbItem, "id">[],
  ): Promise<MlbItem[]> => {
    const { data } = await api.put(`/itens/${itemId}/mlb`, mlbs);
    return data;
  },
};
