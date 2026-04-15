import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { itensService } from "../../lib/item-service";
import type { EstoqueItem } from "../../model/EstoqueItem";

export default function ItemPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<EstoqueItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const carregar = async () => {
            setLoading(true);
            setErro(null);
            try {
                const resposta = await itensService.buscarPorId(id);
                setItem(resposta);
            } catch {
                setErro("Erro ao carregar item. Verifique a conexão com o servidor.");
            } finally {
                setLoading(false);
            }
        };
        carregar();
    }, [id]);

    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: "#d4d0c8" }}>
            {/* Topbar */}
            <div
                className="flex items-center justify-between px-5 py-3 text-white"
                style={{ backgroundColor: "#22252A" }}
            >
                <div>
                    <span className="text-base font-bold tracking-widest" style={{ color: "#ee591f" }}>SÓ IMPORTADOS</span>
                    <span className="ml-3 text-[11px] opacity-50 tracking-wider">ITEM</span>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="text-[11px] px-3 py-1.5 border border-white/30 hover:bg-white/10 transition-colors"
                >
                    ← Voltar
                </button>
            </div>

            <div className="p-4 space-y-3">
                {loading && (
                    <div className="bg-[#ececec] border border-gray-400 px-4 py-8 text-center text-xs text-blue-600 animate-pulse">
                        Carregando item...
                    </div>
                )}

                {erro && (
                    <div className="bg-[#ececec] border border-gray-400 px-4 py-8 text-center text-xs text-red-600">
                        {erro}
                    </div>
                )}

                {!loading && !erro && item && (
                    <div className="bg-[#ececec] border border-gray-400">
                        {/* Header do card */}
                        <div
                            className="px-4 py-2 text-[11px] font-semibold text-white uppercase tracking-wider flex items-center justify-between"
                            style={{ backgroundColor: "#22252A" }}
                        >
                            <span>📦 {item.item}</span>
                            <span className="opacity-50">Cód. {item.codigoItem}</span>
                        </div>

                        {/* Campos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-300">
                            {([
                                ["Código", item.codigoItem],
                                ["Item", item.item],
                                ["Marca", item.marca],
                                ["Referência", item.referencia],
                                ["Fornecedor", item.fornecedor],
                                ["MLB", item.mlb],
                                ["Setor", item.setor],
                                ["Local", item.local],
                                ["Material", item.material],
                                ["Tipo Retentor", item.tipoRetentor],
                                ["Versão Motor", item.versaoMotor],
                                ["Montadora", item.montadora],
                                ["Sentido", item.sentido],
                                ["Quantidade", item.quantidade],
                                ["Qtde. Mínima", item.quantidadeMinima],
                                ["Revisado", item.revisado],
                            ] as [string, unknown][]).map(([label, valor]) => (
                                <div key={label} className="bg-[#ececec] px-4 py-2.5 flex gap-3">
                                    <span className="text-[11px] text-gray-400 uppercase tracking-wider w-32 shrink-0">{label}</span>
                                    <span className="text-[11px] text-gray-800 font-medium">
                                        {valor !== undefined && valor !== null && valor !== "" ? String(valor) : "—"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
