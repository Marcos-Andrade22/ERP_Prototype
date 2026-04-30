import type { Kit } from "../model/Kit";
import type { EstoqueItem } from "../../estoque/model/EstoqueItem";
import { encontrarItem } from "./kit-utils";

/**
 * Calcula quantos kits é possível montar com o estoque atual.
 * Fórmula: min( floor(estoqueItem / qtdeExigida) ) para cada componente.
 * Retorna 0 se qualquer componente não for encontrado ou tiver estoque insuficiente.
 */
export const calcularQuantidadeDisponivelKit = (
  kit: Kit,
  itens: EstoqueItem[],
): number => {
  if (kit.composicao.length === 0) return 0;

  let minimo = Infinity;

  for (const linha of kit.composicao) {
    const item = encontrarItem(itens, linha.codigoItem);
    if (!item) return 0;
    const qtdeMontagensPossiveis = Math.floor(item.quantidade / linha.quantidade);
    if (qtdeMontagensPossiveis < minimo) {
      minimo = qtdeMontagensPossiveis;
    }
  }

  return minimo === Infinity ? 0 : minimo;
};
