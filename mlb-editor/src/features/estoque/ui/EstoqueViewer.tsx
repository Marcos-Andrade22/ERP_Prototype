import { useRef, useState } from "react";
import { ItemForm } from "./ItemForm";
import type { EstoqueItem } from "../model/EstoqueItem";
import { useItens } from "../lib/useItens";

const LIMITE = 20;

const emptyItem: EstoqueItem = {
    codigo_item: '', item: '', unid: '', marca: '', tipoRetentor: '', material: '',
    sentido: '', setor: '', local: '', montadora: '', aplicacoes: '',
    dataFabricacao: '', versaoMotor: '', aplicacoesPossiveis: '',
    fornecedor: '', garantia: '', quantidade: 0, quantidadeMinima: 1,
    mlb: '', posicao: '', conversao: '', referencia: '',
    medidaInterna: '', medidaExterna: '', altura: '', pesoTotal: '',
    historico: '', valorUnitarioFixo: '', valorUnitario: '',
    valorComercialVenda: '', substituicaoTributariaValor: '',
    lucroTipo: 'percent', lucroValor: 0, acrescimoPercent: 0,
    observacoesGerais: '', itensSimilaresCompactibilidade: '',
    situacaoML: '', dataAnuncioML: '', valorML: '',
    situacaoSite: '', dataAnuncioSite: '', valorSite: '',
    pedir: false, promocao: false, revisado: '', alocarParaSite: '',
    reporeSomar: '', imagem: '', rawIndex: 0,
};

export function EstoqueViewer() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [searchInput, setSearchInput] = useState("");

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { items, total, page, loading, erro, setPage, setFiltros } = useItens(LIMITE);

    const totalPaginas = Math.ceil(total / LIMITE);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchInput(val);
        setSelectedIndex(0);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setFiltros(val ? { item: val } : {});
        }, 400);
    };

    const navigate = (delta: number) =>
        setSelectedIndex(i => Math.min(items.length - 1, Math.max(0, i + delta)));

    const selectedItem = items[selectedIndex] ?? emptyItem;

    return (
        <div className="min-h-screen bg-[#d4d0c8] p-4 space-y-3">
            <div className="flex items-center gap-4 flex-wrap bg-[#ececec] border border-gray-400 px-3 py-2 text-xs font-sans">

                {/* Busca */}
                <input
                    type="text"
                    placeholder="🔍 Buscar item..."
                    value={searchInput}
                    onChange={handleSearch}
                    className="border border-blue-300 rounded px-2 py-1 text-xs w-48"
                />

                {loading && <span className="text-blue-600">Carregando...</span>}
                {erro && <span className="text-red-600">{erro}</span>}

                {/* Navegação entre itens */}
                {items.length > 0 && (
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
                                max={items.length}
                                value={selectedIndex + 1}
                                onChange={e =>
                                    setSelectedIndex(
                                        Math.min(items.length - 1, Math.max(0, Number(e.target.value) - 1))
                                    )
                                }
                                className="w-14 border border-gray-300 rounded px-1 text-center"
                            />
                            {' '}de <strong>{items.length}</strong> nesta página
                        </span>

                        <button
                            onClick={() => navigate(1)}
                            disabled={selectedIndex === items.length - 1}
                            className="px-2 py-1 border border-gray-400 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Próximo ›
                        </button>
                    </div>
                )}

                {/* Paginação */}
                {totalPaginas > 1 && (
                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            onClick={() => { setPage(page - 1); setSelectedIndex(0); }}
                            disabled={page === 1}
                            className="px-2 py-1 border border-gray-400 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            « Pág. anterior
                        </button>

                        <span className="text-gray-600">
                            Página <strong>{page}</strong> de <strong>{totalPaginas}</strong>
                        </span>

                        <button
                            onClick={() => { setPage(page + 1); setSelectedIndex(0); }}
                            disabled={page === totalPaginas}
                            className="px-2 py-1 border border-gray-400 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Pág. seguinte »
                        </button>
                    </div>
                )}
            </div>

            <ItemForm
                key={selectedItem.codigo_item || `empty-${selectedIndex}`}
                initialItem={selectedItem}
            />
        </div>
    );
}