import type { EstoqueItem } from "../../estoque/model/EstoqueItem";
import type { Kit } from "../model/Kit";

// Desconta o estoque de cada item que compõe o kit
export const baixarKit = (
  kit: Kit,
  quantidade: number,
  itens: EstoqueItem[],
): EstoqueItem[] => {
  return itens.map((item) => {
    const linha = kit.composicao.find((c) => c.codigoItem === item.codigoItem);
    if (!linha) return item;
    return {
      ...item,
      quantidade: Math.max(0, item.quantidade - linha.quantidade * quantidade),
    };
  });
};

// Verifica se há estoque suficiente para montar X kits
export const validarEstoqueKit = (
  kit: Kit,
  quantidade: number,
  itens: EstoqueItem[],
): boolean => {
  for (const linha of kit.composicao) {
    const item = itens.find((i) => i.codigoItem === linha.codigoItem);
    if (!item || item.quantidade < linha.quantidade * quantidade) return false;
  }
  return true;
};
