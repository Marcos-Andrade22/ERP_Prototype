import { Router, Request, Response } from "express";
import { db } from "../db";
import { campoEstilos } from "../db/schema";
import { eq, and } from "drizzle-orm";

const router = Router({ mergeParams: true });

// ─── GET /itens/:itemId/estilos ───────────────────────────────
// Retorna todos os estilos de campo do item como objeto { campo: corHex }
router.get("/", async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const rows = await db
      .select()
      .from(campoEstilos)
      .where(eq(campoEstilos.itemId, itemId));

    // Transforma em { campo: corHex } para o frontend consumir facilmente
    const resultado: Record<string, string> = {};
    for (const row of rows) {
      if (row.corHex) resultado[row.campo] = row.corHex;
    }

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar estilos do item" });
  }
});

// ─── PUT /itens/:itemId/estilos ───────────────────────────────
// Body: { campo: string, corHex: string | null }
// Faz upsert de um campo por vez (INSERT OR REPLACE)
router.put("/", async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const { campo, corHex }: { campo: string; corHex: string | null } = req.body;

    if (!campo) {
      res.status(400).json({ error: "Campo 'campo' é obrigatório" });
      return;
    }

    // Se corHex for null, remove o estilo do campo
    if (corHex === null) {
      await db
        .delete(campoEstilos)
        .where(
          and(eq(campoEstilos.itemId, itemId), eq(campoEstilos.campo, campo))
        );
      res.json({ ok: true });
      return;
    }

    // Verifica se já existe
    const existente = await db
      .select()
      .from(campoEstilos)
      .where(
        and(eq(campoEstilos.itemId, itemId), eq(campoEstilos.campo, campo))
      );

    if (existente.length > 0) {
      await db
        .update(campoEstilos)
        .set({ corHex })
        .where(
          and(eq(campoEstilos.itemId, itemId), eq(campoEstilos.campo, campo))
        );
    } else {
      await db.insert(campoEstilos).values({ itemId, campo, corHex });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar estilo do campo" });
  }
});

export default router;
