-- Migration 0006: unifica itens_mlb e kits_mlb em mlb_entries
-- Cria a nova tabela unificada
CREATE TABLE IF NOT EXISTS mlb_entries (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id       INTEGER REFERENCES itens(id) ON DELETE CASCADE,
  kit_id        TEXT    REFERENCES kits(id)  ON DELETE CASCADE,
  valor         TEXT    NOT NULL,
  modelo        TEXT    DEFAULT '',
  ean           INTEGER DEFAULT 0,
  cubagem       INTEGER DEFAULT 0,
  otimizado     INTEGER DEFAULT 0,
  full          INTEGER DEFAULT 0,
  patrocinados  INTEGER DEFAULT 0,
  clipe         INTEGER DEFAULT 0,
  revisado      INTEGER DEFAULT 0,
  criado_em     TEXT,
  atualizado_em TEXT
);

-- Migra dados de itens_mlb (sem modelo)
INSERT INTO mlb_entries (item_id, kit_id, valor, modelo, ean, cubagem, otimizado, full, patrocinados, clipe, revisado, criado_em, atualizado_em)
SELECT item_id, NULL, valor, '', ean, cubagem, otimizado, full, patrocinados, clipe, revisado, criado_em, atualizado_em
FROM itens_mlb;

-- Migra dados de kits_mlb (com modelo)
INSERT INTO mlb_entries (item_id, kit_id, valor, modelo, ean, cubagem, otimizado, full, patrocinados, clipe, revisado, criado_em, atualizado_em)
SELECT NULL, kit_id, valor, COALESCE(modelo, ''), ean, cubagem, otimizado, full, patrocinados, clipe, revisado, criado_em, atualizado_em
FROM kits_mlb;

-- Remove tabelas antigas
DROP TABLE IF EXISTS itens_mlb;
DROP TABLE IF EXISTS kits_mlb;
