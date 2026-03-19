// EstoqueItem.ts
export interface EstoqueItem {
  Situacao: string;
  Codigo: string;
  Item: string;
  Fabricante: string;
  Aplicacao: string;
  Quant: number;
  Minimo: number;
  Unid: string;
  Valorunit: number;
  Valorfixo: number;
  Valorcomercial: string;
  Valorcompra: number;
  Acrescimo: number;
  Tipolucro: string;
  Tipotributo: string;
  Tipo: string;
  Setor: string;
  Pedir: boolean;
  Posicao: string; // col[72] — ex: "EAN/Ambientado", "EAN/Cubagem/Otimizado"
  TipoRetentor: string;
  Material: string;
  Materialret: string;
  Local: string;
  Historico: string;
  Data_anuncio_site: string;
  Versao: string;
  StatusML: string;
  Revisado: boolean;
  "MIS::Mensagem simples": string;
  NCM: string;
  Marca: string;
  Desc_anuncio_ML: string;
  Tributo: number;
  "Medida Interna": string;
  "Medida externa": string;
  "Medida Altura": string;
  rawIndex: number;
}
