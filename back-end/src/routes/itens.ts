import { Router, Request, Response } from "express";
import { db } from "../db";
import { itens } from "../db/schema";
import { like, eq, and, SQL } from "drizzle-orm";

const router = Router();

// ─── GET /itens ───────────────────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "20",
      codigo_item,
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
      marca_da_aplicacao,
      pedir,
      revisado,
    } = req.query as Record<string, string>;

    const filters: SQL[] = [];

    if (codigo_item) filters.push(like(itens.codigo_item, `%${codigo_item}%`));
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
    if (marca_da_aplicacao)
      filters.push(like(itens.montadora, `%${marca_da_aplicacao}%`));
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

    res.json({
      data: results,
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

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar item" });
  }
});

// ─── POST /itens ──────────────────────────────────────────────
router.post("/", async (req: Request, res: Response) => {
  try {
    const agora = new Date().toISOString();
    const novoItem = {
      ...req.body,
      criadoEm: agora,
      atualizadoEm: agora,
    };

    const result = await db.insert(itens).values(novoItem).returning();
    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar item" });
  }
});

// ─── PUT /itens/:id ───────────────────────────────────────────
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const dadosAtualizados = {
      ...req.body,
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

    res.json(result[0]);
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

export default router;
