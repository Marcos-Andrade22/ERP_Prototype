export interface EstoqueItem {
  // Identificação
  id?: number;
  codigoItem: string;
  item: string;
  unid: string;
  marca: string;
  tipoRetentor: string;
  material: string;
  sentido: string;
  setor: string;
  local: string;

  // Aplicação
  montadora: string;
  aplicacoes: string;
  dataFabricacao: string;
  versaoMotor: string;
  aplicacoesPossiveis: string;

  // Comercial
  fornecedor: string;
  garantia: string;
  quantidade: number;
  quantidadeMinima: number;
  mlb: string;
  posicao: string;
  conversao: string;
  referencia: string;

  // Medidas
  medidaInterna: string;
  medidaExterna: string;
  altura: string;
  pesoTotal: string;

  // Valores
  valorUnitarioFixo: string;
  valorUnitario: string;
  valorComercialVenda: string;
  substituicaoTributariaTipo: "percent" | "valor";
  substituicaoTributariaValor: string;
  lucroTipo: "percent" | "fixed";
  lucroValor: number;
  acrescimoPercent: number;
  frete: string;
  taxaClienteOficina: number;

  // Texto
  historico: string;
  observacoesGerais: string;
  itensSimilaresCompactibilidade: string;

  // Mercado Livre
  situacaoML: string;
  dataAnuncioML: string;
  valorML: string;

  // Site
  situacaoSite: string;
  dataAnuncioSite: string;
  valorSite: string;

  // Flags
  pedir: boolean;
  promocao: boolean;
  revisado: string;
  alocarParaSite: string;
  reporeSomar: string;

  // Verificação
  verificado?: boolean;

  // Imagem
  imagem: string;

  // Interno
  rawIndex: number;
}
