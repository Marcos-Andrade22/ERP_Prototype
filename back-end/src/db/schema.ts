import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const itens = sqliteTable("itens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  codigo_item: text("codigo_item"),
  item: text("item"),
  unid: text("unid"),
  marca: text("marca"),
  tipoRetentor: text("tipo_retentor"),
  material: text("material"),
  setor: text("setor"),
  local: text("local"),
  posicao: text("posicao"),
  marcaDaAplicacao: text("marca_da_aplicacao"),
  dataFabricacao: text("data_fabricacao"),
  versaoMotor: text("versao_motor"),
  fornecedor: text("fornecedor"),
  quantidade: integer("quantidade").default(0),
  quantidadeMinima: integer("quantidade_minima").default(0),
  valorUnitario: real("valor_unitario").default(0),
  valorTotal: real("valor_total").default(0),
  mlb: text("mlb"),
  situacaoMl: text("situacao_ml"),
  dataAnuncio: text("data_anuncio"),
  valorAnuncio: real("valor_anuncio").default(0),
  pedir: integer("pedir", { mode: "boolean" }).default(false),
  revisado: text("revisado"),
  observacoesGerais: text("observacoes_gerais"),
  itensSimilares: text("itens_similares"),
  aplicacoesPossiveis: text("aplicacoes_possiveis"),
  imagemUrl: text("imagem_url"),
  criadoEm: text("criado_em").default(new Date().toISOString()),
  atualizadoEm: text("atualizado_em").default(new Date().toISOString()),
});

export const kits = sqliteTable("kits", {
  id: text("id").primaryKey(),
  nome: text("nome").notNull(),
  tipo: text("tipo").notNull(), // 'kit' | 'combo' | 'jogo' | 'par'
  composicao: text("composicao").notNull(), // JSON stringificado
  criadoEm: text("criado_em").default(new Date().toISOString()),
});
