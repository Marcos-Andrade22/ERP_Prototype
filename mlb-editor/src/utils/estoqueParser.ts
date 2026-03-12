export interface EstoqueItem {
  codigoProduto: string;
  referencia: string;
  descricao: string;
  tipo: string;
  categoria: string;
  localizacao: string;
  preco: string;
  movimentacoes: string;
}

function decodeWithFallback(buffer: ArrayBuffer): string {
  // Tenta encodings comuns do FileMaker
  const encodings = ["windows-1252"];

  for (const enc of encodings) {
    try {
      const decoder = new TextDecoder(enc as any);
      const text = decoder.decode(buffer);

      // Testa se tem caracteres válidos (não �)
      if (
        (!text.includes("�") && text.includes("ã")) ||
        text.includes("ç") ||
        text.includes("é")
      ) {
        console.log(`✅ Encoding detectado: ${enc}`);
        return text;
      }
    } catch (e) {
      continue;
    }
  }

  // Fallback UTF-8
  console.warn("⚠️ Fallback UTF-8 (pode ter �)");
  return new TextDecoder("utf-8").decode(buffer);
}

export const parseTabelasSi = async (
  filePath: string,
): Promise<EstoqueItem[]> => {
  try {
    const response = await fetch(filePath);
    const buffer = await response.arrayBuffer();
    const text = decodeWithFallback(buffer); // 🔧 AUTO-DETECT

    const lines = text.split("\n").filter((line) => line.trim());
    console.log(`📊 ${lines.length} linhas parseadas`);

    return lines.slice(0, 5000).map((line, index) => {
      const cols = line
        .split("\t")
        .map((c) => c.trim())
        .filter(Boolean);
      return {
        codigoProduto: cols[0] || "",
        referencia: cols[1] || "",
        descricao: cols[2] || "",
        tipo: cols[3] || "",
        categoria: cols[4] || "",
        localizacao: cols[5] || "",
        preco: cols[6]?.replace(",", ".") || "0",
        movimentacoes: cols.slice(7).join(" | "),
        rawIndex: index,
      };
    });
  } catch (error) {
    console.error("Erro parse:", error);
    return [];
  }
};
