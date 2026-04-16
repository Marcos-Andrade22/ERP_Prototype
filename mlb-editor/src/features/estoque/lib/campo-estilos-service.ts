const BASE = "http://localhost:3333";

export const campoEstilosService = {
  async buscar(itemId: number): Promise<Record<string, string>> {
    const res = await fetch(`${BASE}/itens/${itemId}/estilos`);
    if (!res.ok) throw new Error("Erro ao buscar estilos");
    return res.json();
  },

  async salvar(itemId: number, campo: string, corHex: string | null): Promise<void> {
    const res = await fetch(`${BASE}/itens/${itemId}/estilos`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campo, corHex }),
    });
    if (!res.ok) throw new Error("Erro ao salvar estilo");
  },
};
