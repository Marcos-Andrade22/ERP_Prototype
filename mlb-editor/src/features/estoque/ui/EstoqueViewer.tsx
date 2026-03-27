import { useState, type ChangeEvent } from "react";
import { ItemForm } from "./ItemForm";
import type { EstoqueItem } from "../model/EstoqueItem";
import { csvToRawJson } from "../lib/csv-raw-debug";
import { rawRowToFormItem } from "../lib/csv-to-form-item";

const emptyItem: EstoqueItem = {
    item: '', unid: '', marca: '', tipoRetentor: '', material: '',
    sentido: '', setor: '', local: '', marcaDaAplicacao: '', modelo: '',
    dataFabricacao: '', versaoMotor: '', aplicacoesPossiveis: '',
    fornecedor: '', garantia: '', quantidade: 0, quantidadeMinima: 1,
    mlb: '', posicao: '', conversao: '', referencia: '',
    medidaInterna: '', medidaExterna: '', altura: '', pesoTotal: '',
    historico: '', valorUnitarioFixo: '', valorUnitario: '',
    valorComercialVenda: '', substituicaoTributariaValor: '',
    lucroTipo: 'percent', lucroValor: 0, acrecimoPercent: 0,
    observacoesGerais: '', itensSimilaresCompactibilidade: '',
    situacaoML: '', dataAnuncioML: '', valorML: '',
    situacaoSite: '', dataAnuncioSite: '', valorSite: '',
    pedir: false, promocao: false, revisado: '', alocarParaSite: '',
    reporeSomar: '', imagem: '', rawIndex: 0,
};

export function EstoqueViewer() {
    const [items, setItems] = useState<EstoqueItem[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(""); // ← temporário

    const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true);
        try {
            const rawRows = await csvToRawJson(file);
            const converted = rawRows.map((row, idx) => rawRowToFormItem(row, idx));
            setItems(converted);
            setSelectedIndex(0);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    // Filtra pelo campo item quando há busca
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        const found = items.findIndex(i =>
            i.item.toLowerCase().includes(val.toLowerCase())
        );
        if (found !== -1) setSelectedIndex(found);
    };

    const navigate = (delta: number) =>
        setSelectedIndex(i => Math.min(items.length - 1, Math.max(0, i + delta)));

    const selectedItem = items[selectedIndex] ?? emptyItem;
    const total = items.length;

    return (
        <div className="min-h-screen bg-[#d4d0c8] p-4 space-y-3">
            <div className="flex items-center gap-4 flex-wrap bg-[#ececec] border border-gray-400 px-3 py-2 text-xs font-sans">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFile}
                    className="border border-gray-300 rounded px-2 py-1 text-xs"
                />

                {loading && <span className="text-blue-600">Processando...</span>}

                {total > 0 && (
                    <>
                        {/* Busca temporária para teste */}
                        <input
                            type="text"
                            placeholder="🔍 Buscar item..."
                            value={search}
                            onChange={handleSearch}
                            className="border border-blue-300 rounded px-2 py-1 text-xs w-48"
                        />

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigate(-1)}
                                disabled={selectedIndex === 0}
                                className="px-2 py-1 border border-gray-400 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                ‹ Anterior
                            </button>

                            <span className="text-gray-600">
                                Item{' '}
                                <input
                                    type="number"
                                    min={1}
                                    max={total}
                                    value={selectedIndex + 1}
                                    onChange={e =>
                                        setSelectedIndex(
                                            Math.min(total - 1, Math.max(0, Number(e.target.value) - 1))
                                        )
                                    }
                                    className="w-14 border border-gray-300 rounded px-1 text-center"
                                />
                                {' '}de <strong>{total}</strong>
                            </span>

                            <button
                                onClick={() => navigate(1)}
                                disabled={selectedIndex === total - 1}
                                className="px-2 py-1 border border-gray-400 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Próximo ›
                            </button>
                        </div>
                    </>
                )}
            </div>

            <ItemForm initialItem={selectedItem} />
        </div>
    );
}