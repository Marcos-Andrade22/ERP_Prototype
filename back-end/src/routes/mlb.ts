import { Router, Request, Response } from "express";
import { db } from "../db";
import { mlbEntries } from "../db/schema";
import { eq, and, isNull } from "drizzle-orm";

/**
 * Rota unificada de MLBs.
 *
 * GET  /mlb?itemId=1        → lista MLBs de um item
 * GET  /mlb?kitId=abc       → lista MLBs de um kit
 * PUT  /mlb?itemId=1        → replace MLBs de um item
 * PUT  /mlb?kitId=abc       → replace MLBs de um kit
 */
const router = Router();

type MlbPayload = {
  valor: string;
  modelo?: string;
  ean: boolean;
  cubagem: boolean;
  otimizado: boolean;
  full: boolean;
  patrocinados: boolean;
  clipe: boolean;
  revisado: boolean;
};

// ─── GET /mlb ────────────────────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    const { itemId, kitId } = req.query;

    if (!itemId && !kitId) {
      res.status(400).json({ error: "Informe itemId ou kitId como query param" });
      return;
    }

    const results = itemId
      ? await db.select().from(mlbEntries).where(
          and(eq(mlbEntries.itemId, parseInt(itemId as string)), isNull(mlbEntries.kitId))
        )
      : await db.select().from(mlbEntries).where(
          and(eq(mlbEntries.kitId, kitId as string), isNull(mlbEntries.itemId))
        );

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar MLBs" });
  }
});

// ─── PUT /mlb ────────────────────────────────────────────────
router.put("/", async (req: Request, res: Response) => {
  try {
    const { itemId, kitId } = req.query;
    const agora = new Date().toISOString();

    if (!itemId && !kitId) {
      res.status(400).json({ error: "Informe itemId ou kitId como query param" });
      return;
    }

    const lista: MlbPayload[] = req.body;
    if (!Array.isArray(lista)) {
      res.status(400).json({ error: "Body deve ser um array de MLBs" });
      return;
    }

    // Remove entradas antigas
    if (itemId) {
      await db.delete(mlbEntries).where(
        and(eq(mlbEntries.itemId, parseInt(itemId as string)), isNull(mlbEntries.kitId))
      );
    } else {
      await db.delete(mlbEntries).where(
        and(eq(mlbEntries.kitId, kitId as string), isNull(mlbEntries.itemId))
      );
    }

    // Insere a lista nova
    if (lista.length > 0) {
      await db.insert(mlbEntries).values(
        lista.map((mlb) => ({
          itemId: itemId ? parseInt(itemId as string) : null,
          kitId: kitId ? (kitId as string) : null,
          valor: mlb.valor,
          modelo: mlb.modelo ?? "",
          ean: mlb.ean ?? false,
          cubagem: mlb.cubagem ?? false,
          otimizado: mlb.otimizado ?? false,
          full: mlb.full ?? false,
          patrocinados: mlb.patrocinados ?? false,
          clipe: mlb.clipe ?? false,
          revisado: mlb.revisado ?? false,
          criadoEm: agora,
          atualizadoEm: agora,
        }))
      );
    }

    // Retorna a lista atualizada
    const resultado = itemId
      ? await db.select().from(mlbEntries).where(
          and(eq(mlbEntries.itemId, parseInt(itemId as string)), isNull(mlbEntries.kitId))
        )
      : await db.select().from(mlbEntries).where(
          and(eq(mlbEntries.kitId, kitId as string), isNull(mlbEntries.itemId))
        );

    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar MLBs" });
  }
});

export default router;
