import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const itens = sqliteTable("itens", {
  // ─── Identificação ───────────────────────────────────────
  id: integer("id").primaryKey({ autoIncrement: true }),
  referencia: text("referencia"), // col_0
  marca: text("marca"), // col_1
  mlb: text("mlb"), // col_2
  observacoesGerais: text("observacoes_gerais"), // col_4
  conversao: text("conversao"), // col_7
  dataFabricacao: text("data_fabricacao"), // col_8
  revisado: text("revisado"), // col_9
  dataAnuncio: text("data_anuncio"), // col_10
  situacaoMl: text("situacao_ml"), // col_11
  sentido: text("sentido"), // col_12
  fornecedor: text("fornecedor"), // col_13
  garantia: text("garantia"), // col_14
  item: text("item"), // col_15
  local: text("local"), // col_16
  montadora: text("montadora"), // col_17
  material: text("material"), // col_18
  quantidadeMinima: integer("quantidade_minima").default(0), // col_19
  aplicacoes: text("aplicacoes"), // col_20
  tipoRetentor: text("tipo_retentor"), // col_21
  posicao: text("posicao"), // col_24
  alocarParaSite: text("alocar_para_site"), // col_25
  reporeSomar: text("repore_somar"), // col_29
  aplicacoesPossiveis: text("aplicacoes_possiveis"), // col_30
  setor: text("setor"), // col_32
  itensSimilares: text("itens_similares"), // col_33
  unid: text("unid"), // col_36
  valorAnuncio: real("valor_anuncio").default(0), // col_37
  versaoMotor: text("versao_motor"), // col_38

  // ─── Valores ─────────────────────────────────────────────
  valorUnitarioFixo: real("valor_unitario_fixo").default(0), // col_46
  valorUnitario: real("valor_unitario").default(0), // col_48
  valorComercialVenda: real("valor_comercial_venda").default(0), // col_50
  substituicaoTributariaValor: real("substituicao_tributaria_valor").default(0), // col_52

  // ─── Estoque ─────────────────────────────────────────────
  quantidade: integer("quantidade").default(0), // col_65
  flags: text("flags"), // col_73

  // ─── Medidas ─────────────────────────────────────────────
  medidaInterna: real("medida_interna").default(0), // col_76
  medidaExterna: real("medida_externa").default(0), // col_77
  altura: real("altura").default(0), // col_78
  pesoTotal: real("peso_total").default(0), // col_79

  // ─── Histórico / Extra ────────────────────────────────────
  historico: text("historico"), // col_84
  marcaDaAplicacao: text("marca_da_aplicacao"),
  imagemUrl: text("imagem_url"),
  pedir: integer("pedir", { mode: "boolean" }).default(false),
  valorTotal: real("valor_total").default(0),

  // ─── Novos Campos ────────────────────────────────────
  lucroTipo: text("lucro_tipo").default("percent"),
  lucroValor: real("lucro_valor").default(0),
  acrescimoPercent: real("acrescimo_percent").default(0),
  situacaoSite: text("situacao_site"),
  dataAnuncioSite: text("data_anuncio_site"),
  valorSite: real("valor_site").default(0),

  // ─── Controle ────────────────────────────────────────────
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

export const itensMLB = sqliteTable("itens_mlb", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  itemId: integer("item_id")
    .notNull()
    .references(() => itens.id, { onDelete: "cascade" }),
  valor: text("valor").notNull(),
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
