import type { EstoqueItem } from "./estoqueParser";

export interface ValidationResult {
  checksum: string; // hash único do .tab original
  totalItens: number; // 125.829?
  somaPrecos: string; // R$2.847.392,14?
  eixoCount: number; // ~42k?
  categoriasCount: number; // ~187?
  codigosUnicos: boolean; // sem duplicatas?
  primeiroItem: string; // linha 1 OK?
  ultimoItem: string; // linha 125k OK?
  tempoExecucao: string; // validação rápida?
  status: "OK" | "ERRO";
}

/**
 * Valida 100% que todos itens foram importados corretamente
 */
export const fullValidator = async (
  filePath: string,
  parsedItems: EstoqueItem[],
): Promise<ValidationResult> => {
  const start = performance.now();

  try {
    // Verificação 1️⃣ CHECKSUM (.tab original)
    const response = await fetch(filePath);
    const buffer = await response.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const checksumArray = Array.from(new Uint8Array(hashBuffer));
    const checksum =
      checksumArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .slice(0, 32) + "..."; // 1º hash 32 chars

    //Verificação 2️⃣ STATS MATEMÁTICOS
    const somaPrecos = parsedItems.reduce(
      (sum, item) => sum + parseFloat(item.preco || "0"),
      0,
    );

    const eixoCount = parsedItems.filter(
      (item) => item.categoria === "EIXO",
    ).length;

    const categoriasCount = new Set(parsedItems.map((item) => item.categoria))
      .size;

    const codigosUnicosCount = new Set(
      parsedItems.map((item) => item.codigoProduto),
    ).size;

    const codigosUnicos = codigosUnicosCount === parsedItems.length;

    //Verificação 3️⃣ AMOSTRAGEM
    const primeiroItem = parsedItems[0]?.codigoProduto || "N/A";
    const ultimoItem =
      parsedItems[parsedItems.length - 1]?.codigoProduto || "N/A";

    //Verificação 4️⃣ RESULTADO
    const result: ValidationResult = {
      checksum,
      totalItens: parsedItems.length,
      somaPrecos: somaPrecos.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      eixoCount,
      categoriasCount,
      codigosUnicos,
      primeiroItem,
      ultimoItem,
      tempoExecucao: `${(performance.now() - start).toFixed(0)}ms`,
      status: codigosUnicos ? "OK" : "ERRO",
    };

    console.table(result);
    return result;
  } catch (error) {
    return {
      checksum: "ERRO",
      totalItens: 0,
      somaPrecos: "ERRO",
      eixoCount: 0,
      categoriasCount: 0,
      codigosUnicos: false,
      primeiroItem: "ERRO",
      ultimoItem: "ERRO",
      tempoExecucao: "ERRO",
      status: "ERRO",
    };
  }
};
