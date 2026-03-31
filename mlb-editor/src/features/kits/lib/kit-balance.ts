import type { EstoqueItem } from "../../estoque/model/EstoqueItem";
import type { Kit } from "../model/Kit";

export const baixarKit = (
  kit: Kit,
  quantidade: number,
  itens: EstoqueItem[],
): EstoqueItem[] => {
  return itens.map((item) => {
    const linha = kit.composicao.find((c) => c.itemCodigo === item.referencia);
    if (!linha) return item;

    return {
      ...item,
      quantidade: Math.max(0, item.quantidade - linha.quantidade * quantidade),
    };
  });
};

export const validarEstoqueKit = (
  kit: Kit,
  quantidade: number,
  itens: EstoqueItem[],
): boolean => {
  for (const linha of kit.composicao) {
    const item = itens.find((i) => i.referencia === linha.itemCodigo);
    if (!item || item.quantidade < linha.quantidade * quantidade) {
      return false;
    }
  }
  return true;
};
