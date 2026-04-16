const BASE = "http://localhost:3333";

export interface CampoEstilo {
  corHex: string | null;
  negrito: boolean;
  italico: boolean;
  sublinhado: boolean;
  highlight: string | null;
}

export const campoEstilosService = {
  async buscar(itemId: number): Promise<Record<string, CampoEstilo>> {
    const res = await fetch(`${BASE}/itens/${itemId}/estilos`);
    if (!res.ok) throw new Error("Erro ao buscar estilos");
    return res.json();
  },

  async salvar(
    itemId: number,
    campo: string,
    patch: Partial<CampoEstilo>
  ): Promise<void> {
    const res = await fetch(`${BASE}/itens/${itemId}/estilos`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campo, ...patch }),
    });
    if (!res.ok) throw new Error("Erro ao salvar estilo");
  },
};
