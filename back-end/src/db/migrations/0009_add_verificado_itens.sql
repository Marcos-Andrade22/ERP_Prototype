-- Migration: adiciona coluna verificado na tabela itens
ALTER TABLE "itens" ADD COLUMN IF NOT EXISTS "verificado" boolean DEFAULT false;
