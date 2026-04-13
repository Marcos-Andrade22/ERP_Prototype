import type { EstoqueItem } from "../../estoque/model/EstoqueItem";
import type { Kit } from "../model/Kit";

export const calcularValorKit = (kit: Kit, itens: EstoqueItem[]): number => {
  return kit.composicao.reduce((total, linha) => {
    const item = itens.find((i) => i.referencia === linha.codigoItem);
    return total + Number(item?.valorUnitario ?? 0) * linha.quantidade;
  }, 0);
};
