export interface KitComposicao {
  codigoItem: string; // ← era itemCodigo, agora usa o novo campo
  quantidade: number;
}

export interface Kit {
  id: string;
  nome: string;
  tipo: "kit" | "unidade" | "jogo" | "par";
  composicao: KitComposicao[];
  valorCalculado?: number; // computado somando os itens
}
