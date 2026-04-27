import { api } from "../../../shared/lib/api";

export interface KitMlbEntry {
  id?: number;
  kitId?: string;
  valor: string;       // código de 10 dígitos
  modelo: string;      // ex: "TRITON", "PAJERO FULL", ""
  ean: boolean;
  cubagem: boolean;
  otimizado: boolean;
  full: boolean;
  patrocinados: boolean;
  clipe: boolean;
  revisado: boolean;
}

/**
 * Parseia uma string bruta do campo MLB em entradas estruturadas.
 * Regra: cada entrada começa com exatamente 10 dígitos consecutivos,
 * seguidos de texto opcional (modelo do carro) até o próximo número de 10 dígitos.
 * Qualquer token que NÃO comece com 10 dígitos é descartado.
 *
 * Exemplo de entrada:
 *   "1714432252 TRITON   5498152508 PAJERO dakar  5497844498 PAJERO FULL"
 * Saída:
 *   [ { valor: "1714432252", modelo: "TRITON" }, ... ]
 */
export function parsearMlbBruto(raw: string): KitMlbEntry[] {
  if (!raw?.trim()) return [];

  // Divide a string em "blocos" que começam com 10 dígitos
  const regex = /(\d{10})([^\d]*)/g;
  const entradas: KitMlbEntry[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(raw)) !== null) {
    const valor = match[1];
    const modelo = match[2].trim().toUpperCase();
    entradas.push({
      valor,
      modelo,
      ean: false,
      cubagem: false,
      otimizado: false,
      full: false,
      patrocinados: false,
      clipe: false,
      revisado: false,
    });
  }

  return entradas;
}

export const kitMlbService = {
  listar: async (kitId: string): Promise<KitMlbEntry[]> => {
    const { data } = await api.get(`/kits/${kitId}/mlb`);
    return data;
  },

  salvar: async (kitId: string, lista: KitMlbEntry[]): Promise<KitMlbEntry[]> => {
    const { data } = await api.put(`/kits/${kitId}/mlb`, lista);
    return data;
  },
};
