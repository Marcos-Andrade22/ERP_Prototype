import { useNavigate } from "react-router-dom";
import PendenciasPanel from "../panels/PendenciasPanel";

export default function DashboardPage() {
    const navigate = useNavigate();

    const modulos = [
        { label: "Estoque", descricao: "Gerenciar e buscar itens", rota: "/estoque", emoji: "📦" },
        { label: "Kits", descricao: "Montar e balancear kits", rota: "/kits", emoji: "🔧" },
        { label: "Emitir Notas", descricao: "Emissão de notas fiscais", rota: "/emitir-notas", emoji: "🧾" },
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
                    <span className="ml-3 text-[11px] opacity-50 tracking-wider">DASHBOARD</span>
                </div>
                <button
                    onClick={() => navigate("/login")}
                    className="text-[11px] px-3 py-1.5 border border-white/30 hover:bg-white/10 transition-colors"
                >
                    Sair
                </button>
            </div>

            <div className="p-4 space-y-4">
                {/* Módulos */}
                <div>
                    <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2">Módulos</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {modulos.map((mod) => (
                            <button
                                key={mod.rota}
                                onClick={() => navigate(mod.rota)}
                                className="bg-[#ececec] border border-gray-400 px-4 py-4 text-left hover:bg-white transition-colors group"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">{mod.emoji}</span>
                                    <span className="text-sm font-bold text-gray-800 uppercase tracking-wide group-hover:text-orange-600 transition-colors">
                                        {mod.label}
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-500">{mod.descricao}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pendências */}
                <PendenciasPanel />
            </div>
        </div>
    );
}
