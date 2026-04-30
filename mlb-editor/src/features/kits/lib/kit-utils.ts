import type { EstoqueItem } from "../../estoque/model/EstoqueItem";

/** Converte qualquer valor para string, retornando "" para null/undefined */
export const str = (v: unknown): string => (v == null ? "" : String(v));

/** Busca um item do estoque pelo campo `item` ou `codigoItem` */
export const encontrarItem = (
  itens: EstoqueItem[],
  identificador: string,
): EstoqueItem | undefined =>
  itens.find(
    i => str(i.item) === identificador || str(i.codigoItem) === identificador,
  );
