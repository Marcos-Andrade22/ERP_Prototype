import type { EstoqueItem } from "../../estoque/model/EstoqueItem";
import type { Kit } from "../model/Kit";
import { calcularValorComercial } from "../../estoque/lib/estoque-calc";

// Calcula o valor total do kit somando valorComercial × quantidade de cada item
export const calcularValorKit = (kit: Kit, itens: EstoqueItem[]): number => {
  return kit.composicao.reduce((total, linha) => {
    const item = itens.find(
      i => i.item === linha.codigoItem || i.codigoItem === linha.codigoItem
    );
    return total + (item ? calcularValorComercial(item) : 0) * linha.quantidade;
  }, 0);
};
