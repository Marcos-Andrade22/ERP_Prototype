import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemForm } from "./ItemForm";
import type { EstoqueItem } from "../model/EstoqueItem";
import { useItens } from "../lib/useItens";
import { itensService } from "../lib/item-service";

const LIMITE = 20;

const emptyItem: EstoqueItem = {
    codigoItem: '', item: '', unid: '', marca: '', tipoRetentor: '', material: '',
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
    reporeSomar: '', imagem: '', rawIndex: 0, substituicaoTributariaTipo: 'percent', frete: '', taxaClienteOficina: 0
};

const mergeComDefaults = (item: EstoqueItem): EstoqueItem => ({
    ...emptyItem,
    ...Object.fromEntries(
        Object.entries(item).filter(([_, v]) => v !== undefined && v !== null)
    ),
});

interface EstoqueViewerProps {
    itemIdInicial?: number;
}

export function EstoqueViewer({ itemIdInicial }: EstoqueViewerProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [itemForcado, setItemForcado] = useState<EstoqueItem | null>(null);

    const navigate = useNavigate();

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { items, total, page, loading, erro, setPage, setFiltros } = useItens(LIMITE);

    const totalPaginas = Math.ceil(total / LIMITE);

    // Busca o item diretamente pelo id quando vindo da página de resultados
    useEffect(() => {
        if (!itemIdInicial) return;
        itensService.buscarPorId(itemIdInicial).then(item => {
            setItemForcado(mergeComDefaults(item));
        });
    }, [itemIdInicial]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchInput(val);
        setSelectedIndex(0);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setFiltros(val ? { item: val } : {});
        }, 400);
    };

    const handleDelete = async () => {
        const itemAtual = itemForcado ?? items[selectedIndex];
        if (!itemAtual?.id) return;

        const confirmado = window.confirm(`Excluir "${itemAtual.item}"?`);
        if (!confirmado) return;

        await itensService.deletar(itemAtual.id);

        setItemForcado(null);
        setSelectedIndex(i => Math.max(0, i - 1));
        setFiltros(searchInput ? { item: searchInput } : {});
    };

    const navigateItem = (delta: number) => {
        setItemForcado(null);
        setSelectedIndex(i => Math.min(items.length - 1, Math.max(0, i + delta)));
    };

    const selectedItem = itemForcado
        ?? (items[selectedIndex] ? mergeComDefaults(items[selectedIndex]) : emptyItem);

    return (
        <div className="min-h-screen bg-[#d4d0c8] font-sans">
            {/* Topbar */}
            <div
                className="flex items-center justify-between px-5 py-3 text-white"
                style={{ backgroundColor: "#22252A" }}
            >
                <div>
                    <span className="text-base font-bold tracking-widest" style={{ color: "#ee591f" }}>SÓ IMPORTADOS</span>
                    <span className="ml-3 text-[11px] opacity-50 tracking-wider">EDITOR DE ITEM</span>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="text-[11px] px-3 py-1.5 border border-white/30 hover:bg-white/10 transition-colors"
                >
                    ← Voltar
                </button>
            </div>

            <div className="p-4 space-y-3">
                {/* Barra de controles */}
                <div className="flex items-center gap-4 flex-wrap bg-[#ececec] border border-gray-400 px-3 py-2 text-xs">

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
                                onClick={() => navigateItem(-1)}
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
                                    onChange={e => {
                                        setItemForcado(null);
                                        setSelectedIndex(
                                            Math.min(items.length - 1, Math.max(0, Number(e.target.value) - 1))
                                        );
                                    }}
                                    className="w-14 border border-gray-300 rounded px-1 text-center"
                                />
                                {' '}de <strong>{items.length}</strong> nesta página
                            </span>

                            <button
                                onClick={() => navigateItem(1)}
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
                    key={selectedItem.codigoItem || selectedItem.id || `empty-${selectedIndex}`}
                    initialItem={selectedItem}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
