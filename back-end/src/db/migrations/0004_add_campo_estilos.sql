CREATE TABLE IF NOT EXISTS campo_estilos (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL REFERENCES itens(id) ON DELETE CASCADE,
  campo   TEXT NOT NULL,
  cor_hex TEXT,
  UNIQUE(item_id, campo)
);
