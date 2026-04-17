-- Migration 0005: adiciona colunas de estilo na tabela campo_estilos
ALTER TABLE campo_estilos ADD COLUMN negrito INTEGER DEFAULT 0;
ALTER TABLE campo_estilos ADD COLUMN italico INTEGER DEFAULT 0;
ALTER TABLE campo_estilos ADD COLUMN sublinhado INTEGER DEFAULT 0;
ALTER TABLE campo_estilos ADD COLUMN highlight TEXT;
