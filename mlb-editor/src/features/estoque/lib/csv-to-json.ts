import Papa from "papaparse";
import type { EstoqueItem } from "../model/EstoqueItem";

interface ParseResult {
  itens: EstoqueItem[];
  total: number;
  duplicatas: number;
  erros: number;
}

const fixCodigo = (raw: string): string =>
  raw.replace(
    /P-([\d.]+e[+\-]\d+)/gi,
    (_, n) => "P-" + Math.round(parseFloat(n)),
  );

const parseBR = (val: string): number => {
  if (!val || val === "?" || val.trim() === "") return 0;
  return parseFloat(val.replace(",", ".")) || 0;
};

export const csvToEstoqueJson = (csvFile: File): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const decoder = new TextDecoder("utf-8");
        let text = decoder.decode(buffer);

        // Remove BOM
        if (text.startsWith("\uFEFF")) text = text.slice(1);

        // Remove o ";" ao final de cada linha (terminador do FileMaker)
        const cleaned = text
          .split("\n")
          .map((line) => {
            const l = line.endsWith("\r") ? line.slice(0, -1) : line;
            return l.endsWith(";") ? l.slice(0, -1) : l;
          })
          .join("\n");

        Papa.parse(cleaned, {
          header: false,
          delimiter: ",",
          skipEmptyLines: true,
          complete: (results: any) => {
            const rows = results.data as string[][];

            const itens: EstoqueItem[] = rows
              .map((c: string[], index: number) => {
                // Detecta offset: se c[0] não é Codigo (sem ".P-"), tem STATUS
                const CODIGO_RE = /\w+\.\w+\.P-/;
                const off = CODIGO_RE.test(c[0] ?? "") ? 0 : 1;

                if (c.length < 85 + off) return null;

                return {
                  Situacao: c[0 + (off === 0 ? -1 : 0)]?.trim() || "",
                  Codigo: fixCodigo(c[0 + off]?.trim() || ""),
                  Item: c[1 + off]?.trim() || "",
                  Fabricante: c[2 + off]?.trim() || "",
                  "Medida Altura": c[5 + off]?.trim() || "",
                  "Medida externa": c[6 + off]?.trim() || "",
                  "Medida Interna": c[7 + off]?.trim() || "",
                  Aplicacao: c[8 + off]?.trim() || "",
                  Quant: parseBR(c[9 + off]),
                  Minimo: parseBR(c[10 + off]),
                  Valorcomercial: c[14 + off]?.trim() || "",
                  Valorunit: parseBR(c[18 + off]),
                  Unid: c[16 + off]?.trim() || "",
                  Valorfixo: parseBR(c[26 + off]),
                  Acrescimo: parseBR(c[31 + off]),
                  Tipolucro: c[32 + off]?.trim() || "",
                  Tipotributo: c[33 + off]?.trim() || "",
                  Tipo: c[35 + off]?.trim() || "",
                  Setor: c[41 + off]?.trim() || "",
                  Pedir: c[59 + off]?.trim() === "Pedir",
                  Posicao:
                    c[72 + off]?.trim() === "?"
                      ? ""
                      : c[72 + off]?.trim() || "",
                  TipoRetentor: c[62 + off]?.trim() || "",
                  Material: c[64 + off]?.trim() || "",
                  Valorcompra: parseBR(c[65 + off]),
                  Local: c[66 + off]?.trim() || "",
                  Historico: c[69 + off]?.trim() || "",
                  Materialret: c[73 + off]?.trim() || "",
                  Data_anuncio_site: c[77 + off]?.trim() || "",
                  Versao: c[79 + off]?.trim() || "",
                  StatusML: c[81 + off]?.trim() || "",
                  Revisado: c[82 + off]?.trim() === "Conferido",
                  "MIS::Mensagem simples": c[83 + off]?.trim() || "",
                  NCM: c[84 + off]?.trim() || "",
                  Marca: c[85 + off]?.trim() || "",
                  Desc_anuncio_ML: c[86 + off]?.trim() || "",
                  Tributo: parseBR(c[88 + off]),
                  rawIndex: index,
                } as EstoqueItem;
              })
              .filter(
                (item): item is EstoqueItem =>
                  item !== null && item.Codigo !== "",
              );

            const codigos = itens.map((i) => i.Codigo);
            resolve({
              itens,
              total: itens.length,
              duplicatas: codigos.length - new Set(codigos).size,
              erros: itens.filter((i) => isNaN(i.Quant)).length,
            });
          },
          error: reject,
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.readAsArrayBuffer(csvFile);
    reader.onerror = reject;
  });
};

export const saveAsJson = (itens: EstoqueItem[], filename = "estoque.json") => {
  const dataStr = JSON.stringify(itens, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  const link = document.createElement("a");
  link.setAttribute("href", dataUri);
  link.setAttribute("download", filename);
  link.click();
};
