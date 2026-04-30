import type { EstoqueItem } from "../model/EstoqueItem";

// ── CÁLCULO DO VALOR COMERCIAL ────────────────────────────────────────────────
// base         = Valor Unitário
// com_lucro    = base × (1 + Lucro%)  OU  base + Lucro R$
// com_acrescimo = com_lucro × (1 + Acréscimo%)
// ST           = base × (ST%)  OU  ST R$ fixo   ← sempre sobre o valor unitário bruto
// Valor Comercial (Venda) = com_acrescimo + ST
export function calcularValorComercial(item: EstoqueItem): number {
  const base      = parseFloat(String(item.valorUnitario))               || 0;
  const lucro     = parseFloat(String(item.lucroValor))                  || 0;
  const acrescimo = (parseFloat(String(item.acrescimoPercent))           || 0) / 100;
  const stVal     = parseFloat(String(item.substituicaoTributariaValor)) || 0;

  const comLucro =
    item.lucroTipo === "percent"
      ? base * (1 + lucro / 100)
      : base + lucro;

  const comAcrescimo = comLucro * (1 + acrescimo);

  // stTipo: "percent" é o default (undefined/vazio também cai aqui)
  const st =
    item.substituicaoTributariaTipo === "valor"
      ? stVal
      : base * (stVal / 100);

  return comAcrescimo + st;
}
