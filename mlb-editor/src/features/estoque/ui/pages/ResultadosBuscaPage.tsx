import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { itensService } from "../../lib/item-service";
import type { EstoqueItem } from "../../model/EstoqueItem";

export function ResultadosBuscaPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [resultados, setResultados] = useState<EstoqueItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        const buscar = async () => {
            setLoading(true);
            setErro(null);
            try {
                const filtros = Object.fromEntries(searchParams.entries());
                const resposta = await itensService.listar({ ...filtros, limit: 100 });
                setResultados(resposta.data ?? []);
            } catch {
                setErro("Erro ao buscar itens. Verifique a conexão com o servidor.");
            } finally {
                setLoading(false);
            }
        };
        buscar();
    }, [searchParams]);

    const filtrosAtivos = Array.from(searchParams.entries());

    return (
        <div className="min-h-screen p-4 space-y-3 font-sans" style={{ backgroundColor: "#d4d0c8" }}>
            <div
                className="flex items-center gap-3 px-4 py-3 text-white"
                style={{ backgroundColor: "#22252A" }}
            >
                <span className="text-lg font-bold" style={{ color: "#ee591f" }}>📋</span>
                <div>
                    <p className="text-sm font-semibold">RESULTADOS DA BUSCA</p>
                    <p className="text-[11px] opacity-70">
                        {filtrosAtivos.map(([k, v]) => `${k}: ${v}`).join(" · ")}
                    </p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="ml-auto text-[11px] px-3 py-1.5 border border-white/30 hover:bg-white/10 transition-colors"
                >
                    ← Voltar à Busca
                </button>
            </div>

            <div className="bg-[#ececec] border border-gray-400">
                <div
                    className="grid grid-cols-12 px-3 py-2 text-[11px] font-semibold text-white border-b border-gray-400"
                    style={{ backgroundColor: "#22252A" }}
                >
                    <div className="col-span-1 text-center">Cód.</div>
                    <div className="col-span-5">Item</div>
                    <div className="col-span-2">Marca</div>
                    <div className="col-span-2">Referência</div>
                    <div className="col-span-1 text-center">Qtde.</div>
                    <div className="col-span-1 text-center">Setor</div>
                </div>

                {loading && (
                    <div className="px-4 py-8 text-center text-xs text-blue-600 animate-pulse">
                        Buscando itens...
                    </div>
                )}
                {erro && (
                    <div className="px-4 py-8 text-center text-xs text-red-600">{erro}</div>
                )}
                {!loading && !erro && resultados.length === 0 && (
                    <div className="px-4 py-8 text-center text-xs text-gray-500">
                        Nenhum item encontrado para os filtros informados.
                    </div>
                )}

                {!loading && resultados.map((item, index) => (
                    <div
                        key={item.id ?? index}
                        onClick={() => navigate("/estoque", { state: { itemId: item.id } })}
                        className={`grid grid-cols-12 px-3 py-2 text-[11px] border-b border-gray-200 cursor-pointer transition-colors
                            ${index % 2 === 0 ? "bg-white" : "bg-[#f5f5f5]"} hover:bg-orange-50`}
                    >
                        <div className="col-span-1 text-center text-gray-500">{item.codigoItem}</div>
                        <div className="col-span-5 font-medium text-gray-900 truncate">{item.item}</div>
                        <div className="col-span-2 text-gray-600">{item.marca}</div>
                        <div className="col-span-2 text-gray-500">{item.referencia}</div>
                        <div
                            className="col-span-1 text-center font-semibold"
                            style={{ color: item.quantidade <= (item.quantidadeMinima ?? 1) ? "#ee591f" : "#22252A" }}
                        >
                            {item.quantidade}
                        </div>
                        <div className="col-span-1 text-center text-gray-500">{item.setor}</div>
                    </div>
                ))}

                {!loading && resultados.length > 0 && (
                    <div className="px-3 py-2 text-[11px] text-gray-500 bg-[#ececec] border-t border-gray-300">
                        {resultados.length} item(ns) encontrado(s)
                    </div>
                )}
            </div>
        </div>
    );
}