-- Migration: adiciona coluna data_anuncio na tabela mlb_entries
ALTER TABLE mlb_entries ADD COLUMN data_anuncio TEXT;
