import { Router, Request, Response } from "express";
import { db } from "../db";
import { itens } from "../db/schema";
import { like, eq, and, SQL } from "drizzle-orm";
import { parse } from "csv-parse/sync";
import { upload } from "../config/multer";

const router = Router();

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
    const novoItem = { ...req.body, criadoEm: agora, atualizadoEm: agora };
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

// ─── POST /itens/importar ─────────────────────────────────────
router.post(
  "/importar",
  upload.single("arquivo"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "Nenhum arquivo enviado" });
        return;
      }

      const conteudo = req.file.buffer.toString("utf-8");

      const registros = parse(conteudo, {
        columns: (header: string[]) => header.map((_, i) => `col_${i}`),
        skip_empty_lines: true,
        trim: true,
        delimiter: ",",
      });

      if (registros.length === 0) {
        res.status(400).json({ error: "CSV vazio ou sem registros válidos" });
        return;
      }

      const mapearItem = (row: Record<string, string>) => {
        const agora = new Date().toISOString();
        const col = (key: string) => (row[key] ?? "").trim();
        const num = (key: string) =>
          parseFloat(col(key).replace(",", ".")) || 0;
        const int = (key: string) => parseInt(col(key)) || 0;

        return {
          referencia: col("col_0"),
          marca: col("col_1"),
          mlb: col("col_2"),
          observacoesGerais: col("col_4"),
          conversao: col("col_7"),
          dataFabricacao: col("col_8"),
          revisado: col("col_9"),
          dataAnuncio: col("col_10"),
          situacaoMl: col("col_11"),
          sentido: col("col_12"),
          fornecedor: col("col_13"),
          garantia: col("col_14"),
          item: col("col_15"),
          local: col("col_16"),
          montadora: col("col_17"),
          material: col("col_18"),
          quantidadeMinima: int("col_19"),
          aplicacoes: col("col_20"),
          tipoRetentor: col("col_21"),
          posicao: col("col_24"),
          alocarParaSite: col("col_25"),
          reporeSomar: col("col_29"),
          aplicacoesPossiveis: col("col_30"),
          setor: col("col_32"),
          itensSimilares: col("col_33"),
          unid: col("col_36"),
          valorAnuncio: num("col_37"),
          versaoMotor: col("col_38"),
          valorUnitarioFixo: num("col_46"),
          valorUnitario: num("col_48"),
          valorComercialVenda: num("col_50"),
          substituicaoTributariaValor: num("col_52"),
          quantidade: int("col_65"),
          flags: col("col_73"),
          medidaInterna: num("col_76"),
          medidaExterna: num("col_77"),
          altura: num("col_78"),
          pesoTotal: num("col_79"),
          historico: col("col_84"),
          pedir: col("col_73").toLowerCase().includes("pedir"),
          criadoEm: agora,
          atualizadoEm: agora,
        };
      };

      const LOTE = 100;
      let inseridos = 0;

      for (let i = 0; i < registros.length; i += LOTE) {
        const lote = registros.slice(i, i + LOTE).map(mapearItem);
        await db.insert(itens).values(lote);
        inseridos += lote.length;
      }

      res.status(201).json({
        message: "Importação concluída com sucesso",
        total: inseridos,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao importar CSV" });
    }
  },
);

export default router;
