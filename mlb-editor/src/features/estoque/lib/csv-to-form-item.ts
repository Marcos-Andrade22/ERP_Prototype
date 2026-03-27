import type { RawRow } from "./csv-raw-debug";
import type { EstoqueItem } from "../model/EstoqueItem";
import { COLUMN_MAP } from "./column-map";

const col = (row: RawRow, c: string): string => row[c]?.trim() ?? "";

const parseQuantidade = (val: string): number => {
  const match = val.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

export const rawRowToFormItem = (row: RawRow, idx: number): EstoqueItem => {
  const flags = col(row, COLUMN_MAP.flags);

  return {
    item: col(row, COLUMN_MAP.item),
    unid: col(row, COLUMN_MAP.unid),
    marca: col(row, COLUMN_MAP.marca),
    tipoRetentor: col(row, COLUMN_MAP.tipoRetentor),
    material: col(row, COLUMN_MAP.material),
    sentido: col(row, COLUMN_MAP.sentido),
    setor: col(row, COLUMN_MAP.setor),
    local: col(row, COLUMN_MAP.local),
    marcaDaAplicacao: col(row, COLUMN_MAP.marcaDaAplicacao),
    modelo: col(row, COLUMN_MAP.modelo),
    dataFabricacao: col(row, COLUMN_MAP.dataFabricacao),
    versaoMotor: col(row, COLUMN_MAP.versaoMotor),
    aplicacoesPossiveis: col(row, COLUMN_MAP.aplicacoesPossiveis),
    fornecedor: col(row, COLUMN_MAP.fornecedor),
    garantia: col(row, COLUMN_MAP.garantia),
    quantidade: parseQuantidade(col(row, COLUMN_MAP.quantidade)),
    quantidadeMinima: parseInt(col(row, COLUMN_MAP.quantidadeMinima)) || 1,
    mlb: col(row, COLUMN_MAP.mlb),
    posicao: col(row, COLUMN_MAP.posicao),
    conversao: col(row, COLUMN_MAP.conversao),
    referencia: col(row, COLUMN_MAP.referencia),
    medidaInterna: col(row, COLUMN_MAP.medidaInterna),
    medidaExterna: col(row, COLUMN_MAP.medidaExterna),
    altura: col(row, COLUMN_MAP.altura),
    pesoTotal: col(row, COLUMN_MAP.pesoTotal),
    historico: col(row, COLUMN_MAP.historico),
    valorUnitarioFixo: col(row, COLUMN_MAP.valorUnitarioFixo),
    valorUnitario: col(row, COLUMN_MAP.valorUnitario),
    valorComercialVenda: col(row, COLUMN_MAP.valorComercialVenda),
    substituicaoTributariaValor: col(
      row,
      COLUMN_MAP.substituicaoTributariaValor,
    ),
    lucroTipo: "percent",
    lucroValor: 0,
    acrecimoPercent: 0,
    observacoesGerais: col(row, COLUMN_MAP.observacoesGerais),
    itensSimilaresCompactibilidade: col(
      row,
      COLUMN_MAP.itensSimilaresCompactibilidade,
    ),
    situacaoML: col(row, COLUMN_MAP.situacaoML),
    dataAnuncioML: col(row, COLUMN_MAP.dataAnuncioML),
    valorML: col(row, COLUMN_MAP.valorML),
    situacaoSite: "",
    dataAnuncioSite: "",
    valorSite: "",
    pedir: flags.includes("Pedir"),
    promocao: flags.includes("Promo"),
    revisado: col(row, COLUMN_MAP.revisado),
    alocarParaSite: col(row, COLUMN_MAP.alocarParaSite),
    reporeSomar: col(row, COLUMN_MAP.reporeSomar),
    imagem: "",
    rawIndex: idx,
  };
};
