export interface KitComposicao {
  codigo_item: string; // ← era itemCodigo, agora usa o novo campo
  quantidade: number;
}

export interface Kit {
  id: string;
  nome: string;
  tipo: "kit" | "combo" | "jogo" | "par";
  composicao: KitComposicao[];
  valorCalculado?: number; // computado somando os itens
}
