import type { EstoqueItem } from "../../estoque/model/EstoqueItem";
import type { Kit } from "../model/Kit";

// ── CÁLCULO DO VALOR COMERCIAL (espelho de TabValores.tsx) ────────────────────
// base = Valor Unitário
// com_lucro     = base × (1 + Lucro%)  OU  base + Lucro R$
// com_acrescimo = com_lucro × (1 + Acréscimo%)
// ST            = base × (ST%)  OU  ST R$ fixo
// Valor Comercial = com_acrescimo + ST
function calcularValorComercial(item: EstoqueItem): number {
  const base      = parseFloat(String(item.valorUnitario))               || 0;
  const lucro     = parseFloat(String(item.lucroValor))                  || 0;
  const acrescimo = (parseFloat(String(item.acrescimoPercent))           || 0) / 100;
  const stVal     = parseFloat(String(item.substituicaoTributariaValor)) || 0;

  const comLucro =
    item.lucroTipo === "percent"
      ? base * (1 + lucro / 100)
      : base + lucro;

  const comAcrescimo = comLucro * (1 + acrescimo);

  const st =
    item.substituicaoTributariaTipo === "valor"
      ? stVal
      : base * (stVal / 100);

  return comAcrescimo + st;
}

// Calcula o valor total do kit somando valorComercial × quantidade de cada item
export const calcularValorKit = (kit: Kit, itens: EstoqueItem[]): number => {
  return kit.composicao.reduce((total, linha) => {
    const item = itens.find(
      i => i.item === linha.codigoItem || i.codigoItem === linha.codigoItem
    );
    return total + (item ? calcularValorComercial(item) : 0) * linha.quantidade;
  }, 0);
};
