import type { EstoqueItem } from "../../estoque/model/EstoqueItem";
import type { Kit } from "../model/Kit";

// Calcula o valor total do kit somando valorUnitario × quantidade de cada item
// Busca por campo "item" (identificador principal enquanto codigoItem é null)
// ou por codigoItem quando disponível
export const calcularValorKit = (kit: Kit, itens: EstoqueItem[]): number => {
  return kit.composicao.reduce((total, linha) => {
    const item = itens.find(
      i => i.item === linha.codigoItem || i.codigoItem === linha.codigoItem
    );
    return total + Number(item?.valorUnitario ?? 0) * linha.quantidade;
  }, 0);
};
