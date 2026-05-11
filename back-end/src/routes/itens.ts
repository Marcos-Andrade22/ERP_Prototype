import { Router, Request, Response } from "express";
import { db } from "../db";
import { itens } from "../db/schema";
import { ilike, eq, and, SQL } from "drizzle-orm";
import type { Column } from "drizzle-orm";
import { parse } from "csv-parse/sync";
import { upload } from "../config/multer";

const router = Router();

// ─── Colunas válidas do schema ────────────────────────────────
const COLUNAS_VALIDAS = new Set([
  "codigoItem",
  "referencia",
  "marca",
  "mlb",
  "observacoesGerais",
  "conversao",
  "dataFabricacao",
  "revisado",
  "dataAnuncio",
  "situacaoMl",
  "sentido",
  "fornecedor",
  "garantia",
  "item",
  "local",
  "montadora",
  "material",
  "quantidadeMinima",
  "aplicacoes",
  "tipoRetentor",
  "posicao",
  "alocarParaSite",
  "reporeSomar",
  "aplicacoesPossiveis",
  "setor",
  "itensSimilares",
  "unid",
  "valorAnuncio",
  "versaoMotor",
  "valorUnitarioFixo",
  "valorUnitario",
  "valorComercialVenda",
  "substituicaoTributariaValor",
  "quantidade",
  "flags",
  "medidaInterna",
  "medidaExterna",
  "altura",
  "pesoTotal",
  "historico",
  "marcaDaAplicacao",
  "imagemUrl",
  "pedir",
  "valorTotal",
  "lucroTipo",
  "lucroValor",
  "acrescimoPercent",
  "situacaoSite",
  "dataAnuncioSite",
  "valorSite",
  "criadoEm",
  "atualizadoEm",
]);

const filtrarColunas = (dados: any): any => {
  return Object.fromEntries(
    Object.entries(dados).filter(([key]) => COLUNAS_VALIDAS.has(key)),
  );
};

// ─── Sanitização ──────────────────────────────────────────────
const sanitize = (value: any): any => {
  if (typeof value === "string") {
    return value.replace(/\0/g, "").replace(/\r/g, "").trim();
  }
  return value;
};

// ─── Mapeamento Frontend ↔ Backend ────────────────────────────
const mapearParaFrontend = (item: any): any => ({
  ...item,
  itensSimilaresCompactibilidade: item.itensSimilares,
  situacaoML: item.situacaoMl,
  dataAnuncioML: item.dataAnuncio,
  valorML: item.valorAnuncio?.toString() ?? "",
});

const mapearParaBanco = (payload: any): any => {
  const RENOMEAR: Record<string, string> = {
    itensSimilaresCompactibilidade: "itensSimilares",
    situacaoML: "situacaoMl",
    dataAnuncioML: "dataAnuncio",
  };

  const dados = { ...payload };

  for (const [de, para] of Object.entries(RENOMEAR)) {
    if (dados[de] !== undefined) {
      dados[para] = dados[de];
      delete dados[de];
    }
  }

  if (dados.valorML !== undefined) {
    dados.valorAnuncio = parseFloat(dados.valorML) || 0;
    delete dados.valorML;
  }

  return filtrarColunas(dados);
};

// ─── Config de filtros ────────────────────────────────────────
const FILTROS_LIKE: Array<[string, Column]> = [
  ["codigo_item", itens.codigoItem],
  ["referencia", itens.referencia],
  ["item", itens.item],
  ["marca", itens.marca],
  ["fornecedor", itens.fornecedor],
  ["material", itens.material],
  ["tipo_retentor", itens.tipoRetentor],
  ["versao_motor", itens.versaoMotor],
  ["montadora", itens.montadora],
  ["sentido", itens.sentido],
  ["mlb", itens.mlb],
];

const FILTROS_EQ: Array<[string, Column]> = [
  ["setor", itens.setor],
  ["local", itens.local],
  ["situacao_ml", itens.situacaoMl],
  ["revisado", itens.revisado],
];

// ─── GET /itens ───────────────────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    const query = req.query as Record<string, string>;
    const { page = "1", limit = "20", all } = query;

    const filters: SQL[] = [];

    for (const [param, col] of FILTROS_LIKE) {
      if (query[param]) filters.push(ilike(col as any, `%${query[param]}%`));
    }

    for (const [param, col] of FILTROS_EQ) {
      if (query[param]) filters.push(eq(col as any, query[param]));
    }

    if (query.pedir !== undefined && query.pedir !== "") {
      filters.push(eq(itens.pedir, query.pedir === "true"));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    if (all === "true") {
      const results = await db.select().from(itens).where(whereClause);
      return res.json({
        data: results.map(mapearParaFrontend),
        page: 1,
        limit: results.length,
        total: results.length,
      });
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const results = await db
      .select()
      .from(itens)
      .where(whereClause)
      .limit(limitNum)
      .offset(offset);

    res.json({
      data: results.map(mapearParaFrontend),
      page: pageNum,
      limit: limitNum,
      total: results.length,
    });
  } catch (error) {
    console.error("GET /itens →", error);
    res.status(500).json({ error: "Erro ao buscar itens" });
  }
});

// ─── GET /itens/:id ───────────────────────────────────────────
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await db
      .select()
      .from(itens)
      .where(eq(itens.id, id))
      .limit(1);

    if (result.length === 0) {
      res.status(404).json({ error: "Item não encontrado" });
      return;
    }

    res.json(mapearParaFrontend(result[0]));
  } catch (error) {
    console.error("GET /itens/:id →", error);
    res.status(500).json({ error: "Erro ao buscar item" });
  }
});

// ─── POST /itens ──────────────────────────────────────────────
router.post("/", async (req: Request, res: Response) => {
  try {
    const agora = new Date().toISOString();
    const dadosBanco = mapearParaBanco(req.body);
    const novoItem = { ...dadosBanco, criadoEm: agora, atualizadoEm: agora };
    const result = await db.insert(itens).values(novoItem).returning();

    res.status(201).json(mapearParaFrontend(result[0]));
  } catch (error) {
    console.error("POST /itens →", error);
    res.status(500).json({ error: "Erro ao criar item" });
  }
});

// ─── PUT /itens/:id ───────────────────────────────────────────
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const dadosBanco = mapearParaBanco(req.body);
    const dadosAtualizados = {
      ...dadosBanco,
      atualizadoEm: new Date().toISOString(),
    };

    const result = await db
      .update(itens)
      .set(dadosAtualizados)
      .where(eq(itens.id, id))
      .returning();

    if (result.length === 0) {
      res.status(404).json({ error: "Item não encontrado" });
      return;
    }

    res.json(mapearParaFrontend(result[0]));
  } catch (error) {
    console.error("PUT /itens/:id →", error);
    res.status(500).json({ error: "Erro ao atualizar item" });
  }
});

// ─── DELETE /itens/:id ────────────────────────────────────────
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await db.delete(itens).where(eq(itens.id, id)).returning();

    if (result.length === 0) {
      res.status(404).json({ error: "Item não encontrado" });
      return;
    }

    res.json({ message: "Item deletado com sucesso", item: result[0] });
  } catch (error) {
    console.error("DELETE /itens/:id →", error);
    res.status(500).json({ error: "Erro ao deletar item" });
  }
});

// ─── POST /itens/importar ─────────────────────────────────────
router.post(
  "/importar",
  upload.single("arquivo"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "Nenhum arquivo enviado" });
        return;
      }

      const conteudo = req.file.buffer.toString("utf-8");

      const registros = parse(conteudo, {
        columns: (header: string[]) => header.map((_, i) => `col_${i}`),
        skip_empty_lines: true,
        trim: true,
        delimiter: ",",
      });

      if (registros.length === 0) {
        res.status(400).json({ error: "CSV vazio ou sem registros válidos" });
        return;
      }

      const mapearItem = (row: Record<string, string>) => {
        const agora = new Date().toISOString();
        const col = (key: string) => sanitize(row[key] ?? "");
        const num = (key: string) =>
          parseFloat(col(key).replace(",", ".")) || 0;
        const int = (key: string) => parseInt(col(key)) || 0;
        const qty = (key: string) => {
          const m = col(key).match(/(\d+)/);
          return m ? parseInt(m[1]) : 0;
        };

        return {
          referencia: col("col_0"),
          marca: col("col_1"),
          mlb: col("col_2"),
          observacoesGerais: col("col_4"),
          conversao: col("col_7"),
          dataFabricacao: col("col_8"),
          revisado: col("col_9"),
          dataAnuncio: col("col_10"),
          situacaoMl: col("col_11"),
          sentido: col("col_12"),
          fornecedor: col("col_13"),
          garantia: col("col_14"),
          item: col("col_15"),
          local: col("col_16"),
          montadora: col("col_17"),
          material: col("col_18"),
          quantidadeMinima: int("col_19"),
          aplicacoes: col("col_20"),
          tipoRetentor: col("col_21"),
          posicao: col("col_24"),
          alocarParaSite: col("col_25"),
          reporeSomar: col("col_29"),
          aplicacoesPossiveis: col("col_30"),
          setor: col("col_32"),
          itensSimilares: col("col_33"),
          unid: col("col_36"),
          valorAnuncio: num("col_37"),
          versaoMotor: col("col_38"),
          valorUnitarioFixo: num("col_46"),
          valorUnitario: num("col_48"),
          valorComercialVenda: num("col_50"),
          substituicaoTributariaValor: num("col_52"),
          quantidade: qty("col_65"),
          flags: col("col_73"),
          medidaInterna: num("col_76"),
          medidaExterna: num("col_77"),
          altura: num("col_78"),
          pesoTotal: num("col_79"),
          historico: col("col_84"),
          pedir: col("col_73").toLowerCase().includes("pedir"),
          criadoEm: agora,
          atualizadoEm: agora,
        };
      };

      const LOTE = 100;
      let inseridos = 0;

      for (let i = 0; i < registros.length; i += LOTE) {
        const lote = registros.slice(i, i + LOTE).map(mapearItem);
        await db.insert(itens).values(lote);
        inseridos += lote.length;
      }

      res.status(201).json({
        message: "Importação concluída com sucesso",
        total: inseridos,
      });
    } catch (error) {
      console.error("POST /itens/importar →", error);
      res.status(500).json({ error: "Erro ao importar CSV" });
    }
  },
);

export default router;
