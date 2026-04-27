import { Router, Request, Response } from "express";
import { db } from "../db";
import { kitsMLB } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router({ mergeParams: true });

// ─── GET /kits/:kitId/mlb ─────────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    const results = await db
      .select()
      .from(kitsMLB)
      .where(eq(kitsMLB.kitId, req.params.kitId));
    res.json(results);
  } catch {
    res.status(500).json({ error: "Erro ao buscar MLBs do kit" });
  }
});

// ─── PUT /kits/:kitId/mlb ─────────────────────────────────────
// Estratégia replace: apaga tudo e insere lista nova
router.put("/", async (req: Request, res: Response) => {
  try {
    const kitId = req.params.kitId;
    const agora = new Date().toISOString();

    const lista: Array<{
      valor: string;
      modelo: string;
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

    await db.delete(kitsMLB).where(eq(kitsMLB.kitId, kitId));

    if (lista.length > 0) {
      await db.insert(kitsMLB).values(
        lista.map((mlb) => ({
          kitId,
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

    const resultado = await db
      .select()
      .from(kitsMLB)
      .where(eq(kitsMLB.kitId, kitId));

    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar MLBs do kit" });
  }
});

export default router;
