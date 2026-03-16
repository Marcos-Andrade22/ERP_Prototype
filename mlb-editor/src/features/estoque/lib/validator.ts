// import type {
//   EstoqueItem,
//   ValidationResult,
// } from "../../../entities/EstoqueItem";
// import { parseTabelasSiFull } from "./parser";

// export const validateImportacao = async (
//   filePath: string,
// ): Promise<ValidationResult> => {
//   const items = await parseTabelasSiFull(filePath);

//   // Stats
//   const somaPrecos = items.reduce(
//     (sum, item) => sum + parseFloat(item.preco || "0"),
//     0,
//   );

//   const eixoCount = items.filter((item) => item.categoria === "EIXO").length;

//   return {
//     checksum: "SHA256 calculado aqui...", // próximo passo
//     totalItens: items.length,
//     somaPrecos: somaPrecos.toLocaleString("pt-BR", {
//       style: "currency",
//       currency: "BRL",
//     }),
//     eixoCount,
//     status: "OK",
//   };
// };
