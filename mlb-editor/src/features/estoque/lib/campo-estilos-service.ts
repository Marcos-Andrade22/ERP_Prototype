import { api } from "../../../shared/lib/api";

export interface CampoEstilo {
  corHex: string | null;
  negrito: boolean;
  italico: boolean;
  sublinhado: boolean;
  highlight: string | null;
}

export const campoEstilosService = {
  async buscar(itemId: number): Promise<Record<string, CampoEstilo>> {
    const { data } = await api.get(`/itens/${itemId}/estilos`);
    return data;
  },

  async salvar(
    itemId: number,
    campo: string,
    patch: Partial<CampoEstilo>,
  ): Promise<void> {
    await api.put(`/itens/${itemId}/estilos`, { campo, ...patch });
  },
};
