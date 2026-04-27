CREATE TABLE IF NOT EXISTS kits_mlb (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  kit_id      TEXT    NOT NULL REFERENCES kits(id) ON DELETE CASCADE,
  valor       TEXT    NOT NULL,
  modelo      TEXT    NOT NULL DEFAULT '',
  ean         INTEGER NOT NULL DEFAULT 0,
  cubagem     INTEGER NOT NULL DEFAULT 0,
  otimizado   INTEGER NOT NULL DEFAULT 0,
  full        INTEGER NOT NULL DEFAULT 0,
  patrocinados INTEGER NOT NULL DEFAULT 0,
  clipe       INTEGER NOT NULL DEFAULT 0,
  revisado    INTEGER NOT NULL DEFAULT 0,
  criado_em   TEXT,
  atualizado_em TEXT
);
