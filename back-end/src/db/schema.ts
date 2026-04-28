import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const itens = sqliteTable("itens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  codigoItem: text("codigo_item"),
  referencia: text("referencia"),
  marca: text("marca"),
  mlb: text("mlb"),
  observacoesGerais: text("observacoes_gerais"),
  conversao: text("conversao"),
  dataFabricacao: text("data_fabricacao"),
  revisado: text("revisado"),
  dataAnuncio: text("data_anuncio"),
  situacaoMl: text("situacao_ml"),
  sentido: text("sentido"),
  fornecedor: text("fornecedor"),
  garantia: text("garantia"),
  item: text("item"),
  local: text("local"),
  montadora: text("montadora"),
  material: text("material"),
  quantidadeMinima: integer("quantidade_minima").default(0),
  aplicacoes: text("aplicacoes"),
  tipoRetentor: text("tipo_retentor"),
  posicao: text("posicao"),
  alocarParaSite: text("alocar_para_site"),
  reporeSomar: text("repore_somar"),
  aplicacoesPossiveis: text("aplicacoes_possiveis"),
  setor: text("setor"),
  itensSimilares: text("itens_similares"),
  unid: text("unid"),
  valorAnuncio: real("valor_anuncio").default(0),
  versaoMotor: text("versao_motor"),
  valorUnitarioFixo: real("valor_unitario_fixo").default(0),
  valorUnitario: real("valor_unitario").default(0),
  valorComercialVenda: real("valor_comercial_venda").default(0),
  substituicaoTributariaValor: real("substituicao_tributaria_valor").default(0),
  quantidade: integer("quantidade").default(0),
  flags: text("flags"),
  medidaInterna: real("medida_interna").default(0),
  medidaExterna: real("medida_externa").default(0),
  altura: real("altura").default(0),
  pesoTotal: real("peso_total").default(0),
  historico: text("historico"),
  marcaDaAplicacao: text("marca_da_aplicacao"),
  imagemUrl: text("imagem_url"),
  pedir: integer("pedir", { mode: "boolean" }).default(false),
  valorTotal: real("valor_total").default(0),
  lucroTipo: text("lucro_tipo").default("percent"),
  lucroValor: real("lucro_valor").default(0),
  acrescimoPercent: real("acrescimo_percent").default(0),
  situacaoSite: text("situacao_site"),
  dataAnuncioSite: text("data_anuncio_site"),
  valorSite: real("valor_site").default(0),
  criadoEm: text("criado_em"),
  atualizadoEm: text("atualizado_em"),
});

export const kits = sqliteTable("kits", {
  id: text("id").primaryKey(),
  nome: text("nome").notNull(),
  tipo: text("tipo").notNull(),
  composicao: text("composicao").notNull(),
  criadoEm: text("criado_em"),
});

/**
 * Tabela unificada de entradas MLB.
 * Uma linha pertence EXCLUSIVAMENTE a um item OU a um kit — nunca aos dois.
 *   item_id  preenchido + kit_id  NULL  → MLB de item
 *   item_id  NULL        + kit_id preenchido → MLB de kit
 *
 * O campo `modelo` é usado principalmente em kits (ex: "TRITON", "PAJERO").
 * Para itens simples fica vazio.
 */
export const mlbEntries = sqliteTable("mlb_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  itemId: integer("item_id").references(() => itens.id, { onDelete: "cascade" }),
  kitId: text("kit_id").references(() => kits.id, { onDelete: "cascade" }),
  valor: text("valor").notNull(),
  modelo: text("modelo").default(""),
  ean: integer("ean", { mode: "boolean" }).default(false),
  cubagem: integer("cubagem", { mode: "boolean" }).default(false),
  otimizado: integer("otimizado", { mode: "boolean" }).default(false),
  full: integer("full", { mode: "boolean" }).default(false),
  patrocinados: integer("patrocinados", { mode: "boolean" }).default(false),
  clipe: integer("clipe", { mode: "boolean" }).default(false),
  revisado: integer("revisado", { mode: "boolean" }).default(false),
  criadoEm: text("criado_em"),
  atualizadoEm: text("atualizado_em"),
});

export const campoEstilos = sqliteTable("campo_estilos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  itemId: integer("item_id")
    .notNull()
    .references(() => itens.id, { onDelete: "cascade" }),
  campo: text("campo").notNull(),
  corHex: text("cor_hex"),
  negrito: integer("negrito", { mode: "boolean" }).default(false),
  italico: integer("italico", { mode: "boolean" }).default(false),
  sublinhado: integer("sublinhado", { mode: "boolean" }).default(false),
  highlight: text("highlight"),
});
