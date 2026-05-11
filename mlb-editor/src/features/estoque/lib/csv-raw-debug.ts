import Papa from "papaparse";

export type RawRow = Record<string, string>;

export const csvToRawJson = (csvFile: File): Promise<RawRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const decoder = new TextDecoder("utf-8");
        let text = decoder.decode(buffer);

        if (text.startsWith("\uFEFF")) text = text.slice(1);

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
            const maxCols = Math.max(...rows.map((r) => r.length));
            const rawRows: RawRow[] = rows.map((row, rowIndex) => {
              const obj: RawRow = { _rowIndex: String(rowIndex) };
              for (let i = 0; i < maxCols; i++) {
                obj[`col_${i}`] = row[i]?.trim() ?? "";
              }
              return obj;
            });
            resolve(rawRows);
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
