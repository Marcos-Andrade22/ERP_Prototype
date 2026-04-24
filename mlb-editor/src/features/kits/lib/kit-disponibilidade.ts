import type { EstoqueItem } from "../../estoque/model/EstoqueItem";
import type { Kit } from "../model/Kit";

const str = (v: unknown): string => (v == null ? "" : String(v));

// Busca o item do estoque pelo campo "item" ou codigoItem
const encontrarItem = (itens: EstoqueItem[], identificador: string): EstoqueItem | undefined =>
  itens.find(i => str(i.item) === identificador || str(i.codigoItem) === identificador);

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
