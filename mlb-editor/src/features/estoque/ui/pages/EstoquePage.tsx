import { useNavigate } from "react-router-dom";

export default function EstoquePage() {
    const navigate = useNavigate();

    const acoes = [
        { label: "Buscar Item", descricao: "Pesquisar por código, marca, referência, etc.", rota: "/estoque/busca", emoji: "🔍" },
        { label: "Montar Kit", descricao: "Compor e balancear kits de produtos", rota: "/kits", emoji: "🔧" },
    ];

    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: "#d4d0c8" }}>
            {/* Topbar */}
            <div
                className="flex items-center justify-between px-5 py-3 text-white"
                style={{ backgroundColor: "#22252A" }}
            >
                <div>
                    <span className="text-base font-bold tracking-widest" style={{ color: "#ee591f" }}>SÓ IMPORTADOS</span>
                    <span className="ml-3 text-[11px] opacity-50 tracking-wider">ESTOQUE</span>
                </div>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-[11px] px-3 py-1.5 border border-white/30 hover:bg-white/10 transition-colors"
                >
                    ← Dashboard
                </button>
            </div>

            <div className="p-4 space-y-3">
                <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Ações</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {acoes.map((acao) => (
                        <button
                            key={acao.rota}
                            onClick={() => navigate(acao.rota)}
                            className="bg-[#ececec] border border-gray-400 px-4 py-4 text-left hover:bg-white transition-colors group"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{acao.emoji}</span>
                                <span className="text-sm font-bold text-gray-800 uppercase tracking-wide group-hover:text-orange-600 transition-colors">
                                    {acao.label}
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-500">{acao.descricao}</p>

                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
