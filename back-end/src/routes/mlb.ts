import { Router, Request, Response } from "express";
import { db } from "../db";
import { mlbEntries, itens } from "../db/schema";
import { eq, and, isNull } from "drizzle-orm";

/**
 * Rota unificada de MLBs.
 *
 * GET  /mlb?itemId=1        → lista MLBs de um item
 * GET  /mlb?kitId=abc       → lista MLBs de um kit
 * PUT  /mlb?itemId=1        → replace MLBs de um item
 * PUT  /mlb?kitId=abc       → replace MLBs de um kit
 * GET  /mlb/buscar          → filtra mlb_entries por campos booleanos, retorna itens
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

const CAMPOS_BOOL = ["ean", "cubagem", "otimizado", "full", "patrocinados", "clipe", "revisado"] as const;
type CampoBool = typeof CAMPOS_BOOL[number];

// ─── GET /mlb/buscar ─────────────────────────────────────────
// Query params: ean=true, cubagem=false, etc. (qualquer combinação)
// Retorna: array de { item, mlbEntry } para os itens que possuem
// pelo menos uma mlb_entry satisfazendo TODOS os filtros informados.
router.get("/buscar", async (req: Request, res: Response) => {
  try {
    const query = req.query as Record<string, string>;

    // Monta filtros booleanos a partir dos query params
    const filtros: Partial<Record<CampoBool, boolean>> = {};
    for (const campo of CAMPOS_BOOL) {
      if (query[campo] !== undefined && query[campo] !== "") {
        filtros[campo] = query[campo] === "true";
      }
    }

    if (Object.keys(filtros).length === 0) {
      res.status(400).json({ error: "Informe ao menos um campo MLB como filtro" });
      return;
    }

    // Busca todas as mlb_entries de itens (sem kit) com JOIN nos itens
    const rows = await db
      .select({
        // Campos do item
        itemId:              itens.id,
        item:                itens.item,
        marca:               itens.marca,
        referencia:          itens.referencia,
        quantidade:          itens.quantidade,
        quantidadeMinima:    itens.quantidadeMinima,
        setor:               itens.setor,
        // Campos da mlb_entry
        mlbId:               mlbEntries.id,
        mlbValor:            mlbEntries.valor,
        mlbModelo:           mlbEntries.modelo,
        ean:                 mlbEntries.ean,
        cubagem:             mlbEntries.cubagem,
        otimizado:           mlbEntries.otimizado,
        full:                mlbEntries.full,
        patrocinados:        mlbEntries.patrocinados,
        clipe:               mlbEntries.clipe,
        revisado:            mlbEntries.revisado,
      })
      .from(mlbEntries)
      .innerJoin(itens, eq(mlbEntries.itemId, itens.id))
      .where(isNull(mlbEntries.kitId));

    // Filtra em memória pelos campos booleanos solicitados
    const filtrados = rows.filter(row =>
      (Object.entries(filtros) as [CampoBool, boolean][]).every(
        ([campo, valor]) => row[campo] === valor
      )
    );

    // Deduplica por itemId (pode haver múltiplos MLBs por item)
    const vistos = new Set<number>();
    const resultado = filtrados.filter(row => {
      if (vistos.has(row.itemId!)) return false;
      vistos.add(row.itemId!);
      return true;
    });

    res.json({ data: resultado, total: resultado.length });
  } catch (err) {
    console.error("GET /mlb/buscar →", err);
    res.status(500).json({ error: "Erro ao buscar por campos MLB" });
  }
});

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

    if (itemId) {
      await db.delete(mlbEntries).where(
        and(eq(mlbEntries.itemId, parseInt(itemId as string)), isNull(mlbEntries.kitId))
      );
    } else {
      await db.delete(mlbEntries).where(
        and(eq(mlbEntries.kitId, kitId as string), isNull(mlbEntries.itemId))
      );
    }

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
