export interface EstoqueItem {
  // Dados básicos (.tab col 0-6)
  item: string;
  unid: string; // "pç", "par", "jg", "kit"
  marca: string;
  tipoRetentor: string;
  material: string;
  setor: string;
  local: string;

  // Dados adicionais
  marcaModelo: string; // "Marca | Modelo"
  dataFabricacao: string;
  versaoMotor: string;
  fornecedor: string;
  quantidadeMinima: number;
  mlb: string;

  // === SEÇÃO MEDIDAS ===
  medidaInterna: string;
  medidaExterna: string;
  altura: string;
  pesoTotal: string;
  historico: string; // Concat cols finais

  // === VALORES COMERCIAIS ===
  valorUnitarioFixo: string;
  valorUnitario: string;
  lucroTipo: "percent" | "valor"; // Radio
  lucroValor: number;
  acrecimoPercent: number;
  valorComercialVenda: string;
  substituicaoTributariaTipo: "percent" | "valor"; // Radio
  substituicaoTributariaValor: string;

  // === HISTÓRICO APLICAÇÃO ===
  observacoesGerais: string;
  itensSimilaresCompactibilidade: string;
  aplicacoesPossiveis: string;

  // === IMAGEM ===
  imagem: string;

  // === MERCADO LIVRE ===
  situacaoML: string;
  dataAnuncioML: string;
  valorML: string;

  // === SITE ===
  situacaoSite: string;
  dataAnuncioSite: string;
  valorSite: string;

  // === CHECKBOXES ===
  pedir: boolean;
  promocao: boolean;
  revisado: boolean;
  alocarParaSite: boolean;
  reponerSomar: boolean;

  // Meta
  rawIndex: number;
}

export interface ValidationResult {
  checksum: string;
  totalItens: number;
  somaPrecos: string;
  eixoCount: number;
  status: "OK" | "ERRO";
}
