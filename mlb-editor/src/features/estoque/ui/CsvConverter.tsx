// src/app/estoque/ui/CsvConverter.tsx
'use client';
import { useState } from 'react';
import { csvToEstoqueJson, saveAsJson } from '../lib/csv-to-json';
import type { EstoqueItem } from '../model/EstoqueItem';

export const CsvConverter = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleConvert = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const parsed = await csvToEstoqueJson(file);
            setResult(parsed);
        } catch (error) {
            console.error('Erro:', error);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">CSV SAGE → JSON</h2>

            <input
                type="file"
                accept=".csv"
                onChange={handleConvert}
                className="file-input file-input-bordered w-full mb-4"
                disabled={loading}
            />

            {loading && <div className="loading loading-spinner loading-lg"></div>}

            {result && (
                <div className="space-y-4">
                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-title">Total itens</div>
                            <div className="stat-value">{result.total}</div>
                        </div>
                        {result.duplicatas > 0 && (
                            <div className="stat">
                                <div className="stat-title">Duplicatas</div>
                                <div className="stat-value text-error">{result.duplicatas}</div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            className="btn btn-primary"
                            onClick={() => saveAsJson(result.itens as EstoqueItem[])}
                        >
                            📥 Download JSON
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => console.table(result.itens.slice(0, 5))}
                        >
                            👀 Preview 5 itens
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
