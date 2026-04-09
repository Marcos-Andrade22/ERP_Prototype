-- Adiciona colunas para lucro, acréscimo e campos do site
ALTER TABLE itens ADD lucro_tipo TEXT DEFAULT 'percent';
ALTER TABLE itens ADD lucro_valor REAL DEFAULT 0;
ALTER TABLE itens ADD acrescimo_percent REAL DEFAULT 0;
ALTER TABLE itens ADD situacao_site TEXT;
ALTER TABLE itens ADD data_anuncio_site TEXT;
ALTER TABLE itens ADD valor_site REAL DEFAULT 0;