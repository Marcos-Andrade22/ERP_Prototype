import { api } from "./api";

/**
 * Entrada unificada de MLB — usada tanto para itens quanto para kits.
 * O campo `modelo` é preenchido principalmente em kits (ex: "TRITON");
 * para itens simples pode ficar vazio.
 */
export interface MlbEntry {
  id?: number;
  itemId?: number | null;
  kitId?: string | null;
  valor: string;
  modelo: string;
  ean: boolean;
  cubagem: boolean;
  otimizado: boolean;
  full: boolean;
  patrocinados: boolean;
  clipe: boolean;
  revisado: boolean;
  foto: boolean;
  dataAnuncio: string | null;
}

export type MlbEntryInput = Omit<MlbEntry, "id" | "itemId" | "kitId">;

/**
 * Parseia texto bruto extraindo códigos de exatamente 10 dígitos.
 * Cada token de 10 dígitos seguido de texto opcional vira uma entrada;
 * o texto posterior ao código é tratado como `modelo` (uppercase).
 *
 * Exemplo: "1714432252 TRITON  5498152508 PAJERO FULL"
 * → [{ valor: "1714432252", modelo: "TRITON" }, { valor: "5498152508", modelo: "PAJERO FULL" }]
 */
export function parsearMlbBruto(raw: string): MlbEntryInput[] {
  if (!raw?.trim()) return [];
  const regex = /(\d{10})([^\d]*)/g;
  const entradas: MlbEntryInput[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(raw)) !== null) {
    entradas.push({
      valor: match[1],
      modelo: match[2].trim().toUpperCase(),
      ean: false,
      cubagem: false,
      otimizado: false,
      full: false,
      patrocinados: false,
      clipe: false,
      revisado: false,
      foto: false,
      dataAnuncio: null,
    });
  }
  return entradas;
}

export const mlbService = {
  listarPorItem: async (itemId: number): Promise<MlbEntry[]> => {
    const { data } = await api.get("/mlb", { params: { itemId } });
    return data;
  },

  listarPorKit: async (kitId: string): Promise<MlbEntry[]> => {
    const { data } = await api.get("/mlb", { params: { kitId } });
    return data;
  },

  salvarPorItem: async (itemId: number, lista: MlbEntryInput[]): Promise<MlbEntry[]> => {
    const { data } = await api.put("/mlb", lista, { params: { itemId } });
    return data;
  },

  salvarPorKit: async (kitId: string, lista: MlbEntryInput[]): Promise<MlbEntry[]> => {
    const { data } = await api.put("/mlb", lista, { params: { kitId } });
    return data;
  },
};
