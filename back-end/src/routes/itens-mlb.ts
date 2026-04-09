import { Router, Request, Response } from "express";
import { db } from "../db";
import { itensMLB } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router({ mergeParams: true }); // ← mergeParams para acessar :itemId

// ─── GET /itens/:itemId/mlb ───────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const results = await db
      .select()
      .from(itensMLB)
      .where(eq(itensMLB.itemId, itemId));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar MLBs do item" });
  }
});

// ─── PUT /itens/:itemId/mlb ───────────────────────────────────
// Estratégia replace: apaga tudo e insere a lista nova
router.put("/", async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const agora = new Date().toISOString();
    const lista: Array<{
      valor: string;
      ean: boolean;
      cubagem: boolean;
      otimizado: boolean;
      full: boolean;
      patrocinados: boolean;
      clipe: boolean;
      revisado: boolean;
    }> = req.body;

    if (!Array.isArray(lista)) {
      res.status(400).json({ error: "Body deve ser um array de MLBs" });
      return;
    }

    // Apaga os MLBs antigos do item
    await db.delete(itensMLB).where(eq(itensMLB.itemId, itemId));

    // Insere os novos (se houver)
    if (lista.length > 0) {
      await db.insert(itensMLB).values(
        lista.map((mlb) => ({
          itemId,
          valor: mlb.valor,
          ean: mlb.ean,
          cubagem: mlb.cubagem,
          otimizado: mlb.otimizado,
          full: mlb.full,
          patrocinados: mlb.patrocinados,
          clipe: mlb.clipe,
          revisado: mlb.revisado,
          criadoEm: agora,
          atualizadoEm: agora,
        })),
      );
    }

    // Retorna a lista atualizada
    const resultado = await db
      .select()
      .from(itensMLB)
      .where(eq(itensMLB.itemId, itemId));

    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar MLBs do item" });
  }
});

export default router;
