import { useState } from 'react';
import { csvToRawJson, type RawRow } from '../lib/csv-raw-debug';

export const CsvRawDebugger = () => {
    const [rows, setRows] = useState<RawRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [maxCols, setMaxCols] = useState(0);
    const [selectedRow, setSelectedRow] = useState(0);
    const [mostrarMaisCompleto, setMostrarMaisCompleto] = useState(false);
    const [indiceMaisCompleto, setIndiceMaisCompleto] = useState(0);


    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true);
        try {
            const result = await csvToRawJson(file);
            setRows(result);
            setMaxCols(
                Math.max(...result.map(r => Object.keys(r).filter(k => k.startsWith('col_')).length))
            );
            const indiceMaisCompleto = result.reduce((bestIdx, row, idx) => {
                const preenchidos = Object.entries(row)
                    .filter(([k, v]) => k.startsWith('col_') && v.trim() !== '').length;
                const bestPreenchidos = Object.entries(result[bestIdx])
                    .filter(([k, v]) => k.startsWith('col_') && v.trim() !== '').length;
                return preenchidos > bestPreenchidos ? idx : bestIdx;
            }, 0);

            setSelectedRow(indiceMaisCompleto);
            setIndiceMaisCompleto(indiceMaisCompleto);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const row = rows[selectedRow];

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-4 font-mono text-xs">
            <h1 className="text-lg font-bold">🔬 CSV Raw Debugger</h1>

            <input
                type="file"
                accept=".csv"
                onChange={handleFile}
                className="border border-gray-300 rounded px-2 py-1"
            />

            {loading && <p className="text-blue-500">Processando...</p>}

            {rows.length > 0 && (
                <>
                    <p className="text-gray-500">
                        <strong>{rows.length}</strong> linhas · <strong>{maxCols}</strong> colunas máximas
                    </p>

                    {/* Seletor de linha */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <label className="text-gray-600">Inspecionar linha:</label>
                            <input
                                type="number"
                                min={0}
                                max={rows.length - 1}
                                value={selectedRow}
                                onChange={e => {
                                    setMostrarMaisCompleto(false);
                                    setSelectedRow(Number(e.target.value));
                                }}
                                disabled={mostrarMaisCompleto}
                                className="w-20 border border-gray-300 rounded px-2 py-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            <span className="text-gray-400">de 0 a {rows.length - 1}</span>
                        </div>

                        {/* Checkbox novo */}
                        <label className="flex items-center gap-2 cursor-pointer select-none border border-blue-200 bg-blue-50 px-3 py-1 rounded hover:bg-blue-100 transition-colors">
                            <input
                                type="checkbox"
                                checked={mostrarMaisCompleto}
                                onChange={e => {
                                    setMostrarMaisCompleto(e.target.checked);
                                    if (e.target.checked) setSelectedRow(indiceMaisCompleto);
                                }}
                                className="h-3 w-3"
                            />
                            <span className="text-blue-700 font-bold">
                                🏆 Linha mais completa {mostrarMaisCompleto ? `(#${indiceMaisCompleto})` : ''}
                            </span>
                        </label>
                    </div>

                    {/* Tabela col → valor */}
                    {row && (
                        <div className="border border-gray-200 rounded overflow-hidden">
                            <table className="w-full text-xs">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left px-3 py-2 w-24">Coluna</th>
                                        <th className="text-left px-3 py-2">Valor</th>
                                        <th className="text-left px-3 py-2 w-24">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(row)
                                        .filter(([key]) => key.startsWith('col_'))
                                        .map(([key, val]) => (
                                            <tr
                                                key={key}
                                                className={val ? 'bg-white' : 'bg-gray-50'}
                                            >
                                                <td className="px-3 py-1 text-blue-600 font-bold">{key}</td>
                                                <td className="px-3 py-1 text-gray-800 break-all">
                                                    {val || <span className="text-gray-300 italic">vazio</span>}
                                                </td>
                                                <td className="px-3 py-1">
                                                    {val
                                                        ? <span className="text-green-600">✅</span>
                                                        : <span className="text-gray-300">—</span>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Download do JSON bruto */}
                    <button
                        onClick={() => {
                            const data = JSON.stringify(rows.slice(0, 50), null, 2);
                            const uri = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
                            const link = document.createElement('a');
                            link.setAttribute('href', uri);
                            link.setAttribute('download', 'csv_raw_debug.json');
                            link.click();
                        }}
                        className="bg-gray-800 text-white px-4 py-2 rounded text-xs hover:bg-gray-700"
                    >
                        📥 Download JSON bruto (50 linhas)
                    </button>
                </>
            )}
        </div>
    );
};