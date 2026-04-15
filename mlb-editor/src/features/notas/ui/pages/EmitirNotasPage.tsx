import { useNavigate } from "react-router-dom";

export default function EmitirNotasPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: "#d4d0c8" }}>
            {/* Topbar */}
            <div
                className="flex items-center justify-between px-5 py-3 text-white"
                style={{ backgroundColor: "#22252A" }}
            >
                <div>
                    <span className="text-base font-bold tracking-widest" style={{ color: "#ee591f" }}>SÓ IMPORTADOS</span>
                    <span className="ml-3 text-[11px] opacity-50 tracking-wider">NOTAS FISCAIS</span>
                </div>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-[11px] px-3 py-1.5 border border-white/30 hover:bg-white/10 transition-colors"
                >
                    ← Dashboard
                </button>
            </div>

            <div className="p-4">
                <div className="bg-[#ececec] border border-gray-400">
                    <div
                        className="px-4 py-2 text-[11px] font-semibold text-white uppercase tracking-wider"
                        style={{ backgroundColor: "#22252A" }}
                    >
                        🧾 Emissão de Notas Fiscais
                    </div>
                    <div className="px-4 py-8 text-center text-[11px] text-gray-400">
                        Funcionalidade de emissão de notas em desenvolvimento.
                    </div>
                </div>
            </div>
        </div>
    );
}
