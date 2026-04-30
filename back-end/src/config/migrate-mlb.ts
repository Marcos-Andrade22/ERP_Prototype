import { db } from "../db";
import { itens } from "../db/schema";

type ParsedMlb = {
  valor: string;
  ean: boolean;
  cubagem: boolean;
  otimizado: boolean;
  full: boolean;
  patrocinados: boolean;
  clipe: boolean;
  revisado: boolean;
};

const parseMlbString = (mlbString: string): ParsedMlb[] => {
  if (!mlbString?.trim()) return [];

  const partes = mlbString
    .trim()
    .split(/(?=\b\d{7,}\b)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return partes.map((parte) => ({
    valor: parte,
    ean: false,
    cubagem: false,
    otimizado: false,
    full: false,
    patrocinados: false,
    clipe: false,
    revisado: false,
  }));
};

// async function migrateMlb() {
//   const agora = new Date().toISOString();

//   const todosItens = await db.select().from(itens);

//   let totalItensComMlb = 0;
//   let totalMlbsInseridos = 0;

//   for (const item of todosItens) {
//     if (!item.id || !item.mlb?.trim()) continue;

//     const mlbs = parseMlbString(item.mlb);

//     if (mlbs.length === 0) continue;

//     totalItensComMlb++;

//     await db.insert(itensMLB).values(
//       mlbs.map((mlb) => ({
//         itemId: item.id!,
//         valor: mlb.valor,
//         ean: mlb.ean,
//         cubagem: mlb.cubagem,
//         otimizado: mlb.otimizado,
//         full: mlb.full,
//         patrocinados: mlb.patrocinados,
//         clipe: mlb.clipe,
//         revisado: mlb.revisado,
//         criadoEm: agora,
//         atualizadoEm: agora,
//       })),
//     );

//     totalMlbsInseridos += mlbs.length;
//     console.log(`Item ${item.id} migrado com ${mlbs.length} MLB(s)`);
//   }

//   console.log("✅ Migração concluída");
//   console.log(`Itens com MLB: ${totalItensComMlb}`);
//   console.log(`MLBs inseridos: ${totalMlbsInseridos}`);
// }

// migrateMlb()
//   .then(() => process.exit(0))
//   .catch((err) => {
//     console.error("❌ Erro na migração de MLB:", err);
//     process.exit(1);
//   });
