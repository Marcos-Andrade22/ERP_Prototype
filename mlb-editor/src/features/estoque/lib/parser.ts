import type { EstoqueItem } from "../model/EstoqueItem";

export const parseTabelasSi = async (): Promise<EstoqueItem[]> => {
  // Simula fetch do seu tabelas_si.tab[file:95]
  const text = await fetch("/api/estoque/tabelas_si").then((r) => r.text());
  const lines = text.split("\n").filter((line) => line.includes("\t"));

  const items: EstoqueItem[] = [];

  lines.slice(0, 5000).forEach((line, rawIndex) => {
    // Performance
    const cols = line
      .split("\t")
      .map((c) => c.trim())
      .filter(Boolean);
    if (cols.length < 7) return;

    const codigo = cols[0];
    const [marcaRaw, itemDesc] = codigo.split(".").slice(1);
    const historicoRaw = cols.slice(7).join(" | ");

    items.push({
      // Dados básicos (.tab)
      item: itemDesc || "",
      unid: extractUnid(historicoRaw),
      marca: marcaRaw || "",
      tipoRetentor: "",
      material: extractMaterial(itemDesc),
      setor: "",
      local: cols[5] || "",

      // Dados adicionais
      marcaModelo: `${marcaRaw || ""} | ${extractModelo(itemDesc)}`,
      dataFabricacao: "",
      versaoMotor: "",
      fornecedor: extractFornecedor(historicoRaw),
      quantidadeMinima: 1,
      mlb: "",

      // Medidas (editáveis)
      medidaInterna: "",
      medidaExterna: "",
      altura: "",
      pesoTotal: "",
      historico: historicoRaw,

      // Valores (defaults)
      valorUnitarioFixo: "",
      valorUnitario: cols[6] || "",
      lucroTipo: "percent",
      lucroValor: 0,
      acrecimoPercent: 0,
      valorComercialVenda: "",
      substituicaoTributariaTipo: "percent",
      substituicaoTributariaValor: "",

      // Histórico (editáveis)
      observacoesGerais: "",
      itensSimilaresCompactibilidade: "",
      aplicacoesPossiveis: "",

      imagem: "",

      // ML + Site
      situacaoML: "",
      dataAnuncioML: "",
      valorML: "",
      situacaoSite: "",
      dataAnuncioSite: "",
      valorSite: "",

      // Checkboxes
      pedir: false,
      promocao: false,
      revisado: false,
      alocarParaSite: false,
      reponerSomar: false,

      rawIndex,
    });
  });

  return items;
};

// Helpers
const extractUnid = (hist: string): string => {
  const m = hist.match(/(\d+)\s+(PS|JG|PAR|KIT|UN|PC)/i);
  return m ? m[2].toUpperCase() : "PC";
};

const extractMaterial = (desc: string): string =>
  desc.match(/(BORRACHA|AÇO|NBR|BRONZ)/i)?.[0]?.toUpperCase() || "";

const extractFornecedor = (hist: string): string =>
  hist.match(/(IMDEPA|BACURITY|VISAO|ROLIMAC|SK)/i)?.[0] || "";

const extractModelo = (desc: string): string =>
  desc.match(/(\d+x\d+(?:\.\d+)?)/)?.[0] || "";
