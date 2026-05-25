-- Migration: add foto column to mlb_entries
ALTER TABLE mlb_entries ADD COLUMN foto BOOLEAN NOT NULL DEFAULT FALSE;
