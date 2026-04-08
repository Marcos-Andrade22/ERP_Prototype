import { Router, Request, Response } from "express";
import { db } from "../db";
import { kits } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

// ─── GET /kits ────────────────────────────────────────────────
router.get("/", async (_req: Request, res: Response) => {
  try {
    const results = await db.select().from(kits);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar kits" });
  }
});

// ─── GET /kits/:id ────────────────────────────────────────────
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await db
      .select()
      .from(kits)
      .where(eq(kits.id, req.params.id))
      .limit(1);

    if (result.length === 0) {
      res.status(404).json({ error: "Kit não encontrado" });
      return;
    }

    const kit = result[0];

    res.json({
      ...kit,
      composicao: JSON.parse(kit.composicao), // devolve já parseado
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar kit" });
  }
});

// ─── POST /kits ───────────────────────────────────────────────
router.post("/", async (req: Request, res: Response) => {
  try {
    const { nome, tipo, composicao } = req.body;

    if (!nome || !tipo || !composicao) {
      res
        .status(400)
        .json({ error: "nome, tipo e composicao são obrigatórios" });
      return;
    }

    const novoKit = {
      id: randomUUID(),
      nome,
      tipo,
      composicao: JSON.stringify(composicao), // salva como JSON string
      criadoEm: new Date().toISOString(),
    };

    const result = await db.insert(kits).values(novoKit).returning();

    res.status(201).json({
      ...result[0],
      composicao: JSON.parse(result[0].composicao),
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar kit" });
  }
});

// ─── PUT /kits/:id ────────────────────────────────────────────
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { nome, tipo, composicao } = req.body;

    const dadosAtualizados: Record<string, unknown> = {};
    if (nome) dadosAtualizados.nome = nome;
    if (tipo) dadosAtualizados.tipo = tipo;
    if (composicao) dadosAtualizados.composicao = JSON.stringify(composicao);

    const result = await db
      .update(kits)
      .set(dadosAtualizados)
      .where(eq(kits.id, req.params.id))
      .returning();

    if (result.length === 0) {
      res.status(404).json({ error: "Kit não encontrado" });
      return;
    }

    res.json({
      ...result[0],
      composicao: JSON.parse(result[0].composicao),
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar kit" });
  }
});

// ─── DELETE /kits/:id ─────────────────────────────────────────
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const result = await db
      .delete(kits)
      .where(eq(kits.id, req.params.id))
      .returning();

    if (result.length === 0) {
      res.status(404).json({ error: "Kit não encontrado" });
      return;
    }

    res.json({ message: "Kit deletado com sucesso", kit: result[0] });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar kit" });
  }
});

export default router;
