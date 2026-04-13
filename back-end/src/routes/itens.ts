import { Router, Request, Response } from "express";
import { db } from "../db";
import { itens } from "../db/schema";
import { like, eq, and, SQL } from "drizzle-orm";
import type { Column } from "drizzle-orm";
import { parse } from "csv-parse/sync";
import { upload } from "../config/multer";

const router = Router();

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

  return dados;
};

// ─── Config de filtros ────────────────────────────────────────
const FILTROS_LIKE: Array<[string, Column]> = [
  ["codigoItem", itens.codigoItem],
  ["referencia", itens.referencia],
  ["item", itens.item],
  ["marca", itens.marca],
  ["fornecedor", itens.fornecedor],
  ["material", itens.material],
  ["tipo_retentor", itens.tipoRetentor],
  ["versao_motor", itens.versaoMotor],
  ["montadora", itens.montadora],
  ["sentido", itens.sentido],
];

const FILTROS_EQ: Array<[string, Column]> = [
  ["mlb", itens.mlb],
  ["setor", itens.setor],
  ["local", itens.local],
  ["situacao_ml", itens.situacaoMl],
  ["revisado", itens.revisado],
];

// ─── GET /itens ───────────────────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    const query = req.query as Record<string, string>;
    const { page = "1", limit = "20" } = query;

    const filters: SQL[] = [];

    for (const [param, col] of FILTROS_LIKE) {
      if (query[param]) filters.push(like(col as any, `%${query[param]}%`));
    }

    for (const [param, col] of FILTROS_EQ) {
      if (query[param]) filters.push(eq(col as any, query[param]));
    }

    if (query.pedir !== undefined && query.pedir !== "") {
      filters.push(eq(itens.pedir, query.pedir === "true"));
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const results = await db
      .select()
      .from(itens)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .limit(limitNum)
      .offset(offset);

    res.json({
      data: results.map(mapearParaFrontend),
      page: pageNum,
      limit: limitNum,
      total: results.length,
    });
  } catch (error) {
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
    console.error("PUT /itens/:id →", error); // ← adiciona
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
    res.status(500).json({ error: "Erro ao deletar item" });
  }
});

// ─── POST /itens/importar ─────────────────────────────────────
router.post(
  "/importar",
  upload.single("arquivo"),
  async (req: Request, res: Response) => {
    // ... importação mantém igual, pois é via CSV
  },
);

export default router;
