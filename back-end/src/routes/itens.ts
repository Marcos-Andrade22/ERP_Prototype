import { Router, Request, Response } from "express";
import { db } from "../db";
import { itens } from "../db/schema";
import { like, eq, and, SQL } from "drizzle-orm";
import { parse } from "csv-parse/sync";
import { upload } from "../config/multer";

const router = Router();

// ─── Mapeamento Frontend ↔ Backend ────────────────────────────
const mapearParaFrontend = (item: any): any => ({
  ...item,
  // Itens Similares
  itensSimilaresCompactibilidade: item.itensSimilares,
  // Mercado Livre (campos que vêm do banco)
  situacaoML: item.situacaoMl,
  dataAnuncioML: item.dataAnuncio,
  valorML: item.valorAnuncio?.toString() ?? "",
});

const mapearParaBanco = (payload: any): any => {
  const dados = { ...payload };

  // Itens Similares
  if (dados.itensSimilaresCompactibilidade !== undefined) {
    dados.itensSimilares = dados.itensSimilaresCompactibilidade;
    delete dados.itensSimilaresCompactibilidade;
  }

  // Mercado Livre (campos que vêm da UI)
  if (dados.situacaoML !== undefined) {
    dados.situacaoMl = dados.situacaoML;
    delete dados.situacaoML;
  }
  if (dados.dataAnuncioML !== undefined) {
    dados.dataAnuncio = dados.dataAnuncioML;
    delete dados.dataAnuncioML;
  }
  if (dados.valorML !== undefined) {
    dados.valorAnuncio = parseFloat(dados.valorML) || 0;
    delete dados.valorML;
  }

  return dados;
};

// ─── GET /itens ───────────────────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "20",
      referencia,
      item,
      marca,
      mlb,
      fornecedor,
      setor,
      local,
      situacao_ml,
      material,
      tipo_retentor,
      versao_motor,
      montadora,
      sentido,
      pedir,
      revisado,
    } = req.query as Record<string, string>;

    const filters: SQL[] = [];

    if (referencia) filters.push(like(itens.referencia, `%${referencia}%`));
    if (item) filters.push(like(itens.item, `%${item}%`));
    if (marca) filters.push(like(itens.marca, `%${marca}%`));
    if (mlb) filters.push(eq(itens.mlb, mlb));
    if (fornecedor) filters.push(like(itens.fornecedor, `%${fornecedor}%`));
    if (setor) filters.push(eq(itens.setor, setor));
    if (local) filters.push(eq(itens.local, local));
    if (situacao_ml) filters.push(eq(itens.situacaoMl, situacao_ml));
    if (material) filters.push(like(itens.material, `%${material}%`));
    if (tipo_retentor)
      filters.push(like(itens.tipoRetentor, `%${tipo_retentor}%`));
    if (versao_motor)
      filters.push(like(itens.versaoMotor, `%${versao_motor}%`));
    if (montadora) filters.push(like(itens.montadora, `%${montadora}%`));
    if (sentido) filters.push(like(itens.sentido, `%${sentido}%`));
    if (revisado) filters.push(eq(itens.revisado, revisado));
    if (pedir !== undefined) filters.push(eq(itens.pedir, pedir === "true"));

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const results = await db
      .select()
      .from(itens)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .limit(limitNum)
      .offset(offset);

    // ← AQUI: aplica mapeamento para o frontend
    const resultsMapped = results.map(mapearParaFrontend);

    res.json({
      data: resultsMapped,
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

    // ← AQUI: aplica mapeamento para o frontend
    const itemMapped = mapearParaFrontend(result[0]);
    res.json(itemMapped);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar item" });
  }
});

// ─── POST /itens ──────────────────────────────────────────────
router.post("/", async (req: Request, res: Response) => {
  try {
    const agora = new Date().toISOString();
    const dadosBanco = mapearParaBanco(req.body); // ← AQUI: mapeia antes de salvar
    const novoItem = { ...dadosBanco, criadoEm: agora, atualizadoEm: agora };
    const result = await db.insert(itens).values(novoItem).returning();

    // ← AQUI: devolve mapeado para o frontend
    res.status(201).json(mapearParaFrontend(result[0]));
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar item" });
  }
});

// ─── PUT /itens/:id ───────────────────────────────────────────
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const dadosBanco = mapearParaBanco(req.body); // ← AQUI: mapeia antes de salvar
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

    // ← AQUI: devolve mapeado para o frontend
    res.json(mapearParaFrontend(result[0]));
  } catch (error) {
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
