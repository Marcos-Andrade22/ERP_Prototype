export interface KitComposicao {
  itemCodigo: string; // referência ao EstoqueItem.referencia
  quantidade: number;
}

export interface Kit {
  id: string;
  nome: string;
  tipo: "kit" | "combo" | "jogo" | "par";
  composicao: KitComposicao[];
  valorCalculado?: number; // computado somando os itens
}
