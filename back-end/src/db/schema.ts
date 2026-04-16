import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const itens = sqliteTable("itens", {
  // ─── Identificação ───────────────────────────────────────
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

  // ─── Valores ─────────────────────────────────────────────
  valorUnitarioFixo: real("valor_unitario_fixo").default(0),
  valorUnitario: real("valor_unitario").default(0),
  valorComercialVenda: real("valor_comercial_venda").default(0),
  substituicaoTributariaValor: real("substituicao_tributaria_valor").default(0),

  // ─── Estoque ─────────────────────────────────────────────
  quantidade: integer("quantidade").default(0),
  flags: text("flags"),

  // ─── Medidas ─────────────────────────────────────────────
  medidaInterna: real("medida_interna").default(0),
  medidaExterna: real("medida_externa").default(0),
  altura: real("altura").default(0),
  pesoTotal: real("peso_total").default(0),

  // ─── Histórico / Extra ────────────────────────────────────
  historico: text("historico"),
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

// ─── Estilos de campo ─────────────────────────────────────────
// Armazena a cor hex de campos individuais por item.
// Futuro: adicionar colunas negrito, italico, etc.
export const campoEstilos = sqliteTable("campo_estilos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  itemId: integer("item_id")
    .notNull()
    .references(() => itens.id, { onDelete: "cascade" }),
  campo: text("campo").notNull(),
  corHex: text("cor_hex"),
});
