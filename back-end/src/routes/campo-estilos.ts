import { Router, Request, Response } from "express";
import { db } from "../db";
import { campoEstilos } from "../db/schema";
import { eq, and } from "drizzle-orm";

const router = Router({ mergeParams: true });

export interface CampoEstilo {
  corHex: string | null;
  negrito: boolean;
  italico: boolean;
  sublinhado: boolean;
  highlight: string | null;
}

// ─── GET /itens/:itemId/estilos ───────────────────────────────
// Retorna { [campo]: CampoEstilo }
router.get("/", async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const rows = await db
      .select()
      .from(campoEstilos)
      .where(eq(campoEstilos.itemId, itemId));

    const resultado: Record<string, CampoEstilo> = {};
    for (const row of rows) {
      resultado[row.campo] = {
        corHex: row.corHex ?? null,
        negrito: Boolean(row.negrito),
        italico: Boolean(row.italico),
        sublinhado: Boolean(row.sublinhado),
        highlight: row.highlight ?? null,
      };
    }

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar estilos do item" });
  }
});

// ─── PUT /itens/:itemId/estilos ───────────────────────────────
// Body: { campo: string } + campos opcionais de CampoEstilo
router.put("/", async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const {
      campo,
      corHex,
      negrito,
      italico,
      sublinhado,
      highlight,
    }: { campo: string } & Partial<CampoEstilo> = req.body;

    if (!campo) {
      res.status(400).json({ error: "Campo 'campo' é obrigatório" });
      return;
    }

    const existente = await db
      .select()
      .from(campoEstilos)
      .where(and(eq(campoEstilos.itemId, itemId), eq(campoEstilos.campo, campo)));

    const payload = {
      ...(corHex !== undefined && { corHex: corHex ?? null }),
      ...(negrito !== undefined && { negrito }),
      ...(italico !== undefined && { italico }),
      ...(sublinhado !== undefined && { sublinhado }),
      ...(highlight !== undefined && { highlight: highlight ?? null }),
    };

    if (existente.length > 0) {
      await db
        .update(campoEstilos)
        .set(payload)
        .where(and(eq(campoEstilos.itemId, itemId), eq(campoEstilos.campo, campo)));
    } else {
      await db.insert(campoEstilos).values({ itemId, campo, ...payload });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar estilo do campo" });
  }
});

export default router;
