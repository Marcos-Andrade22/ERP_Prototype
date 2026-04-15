import { useNavigate } from "react-router-dom";

export default function RegistroPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center font-sans" style={{ backgroundColor: "#d4d0c8" }}>
            <div className="w-full max-w-sm">
                {/* Header */}
                <div className="px-6 py-4 text-white text-center" style={{ backgroundColor: "#22252A" }}>
                    <span className="text-2xl font-bold tracking-widest" style={{ color: "#ee591f" }}>SÓ IMPORTADOS</span>
                    <p className="text-xs opacity-60 mt-1 tracking-wider">SISTEMA ERP — NOVO CADASTRO</p>
                </div>

                {/* Form card */}
                <div className="bg-[#ececec] border border-gray-400 px-6 py-6 space-y-4">
                    <h1 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Criar conta</h1>

                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Nome</label>
                        <input
                            type="text"
                            placeholder="Seu nome completo"
                            className="w-full border border-gray-400 bg-white px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Usuário</label>
                        <input
                            type="text"
                            placeholder="Escolha um usuário"
                            className="w-full border border-gray-400 bg-white px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Senha</label>
                        <input
                            type="password"
                            placeholder="Escolha uma senha"
                            className="w-full border border-gray-400 bg-white px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                        />
                    </div>

                    <button
                        className="w-full py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "#22252A" }}
                    >
                        Criar conta
                    </button>

                    <div className="border-t border-gray-300 pt-3 text-center">
                        <button
                            onClick={() => navigate("/login")}
                            className="text-[11px] text-gray-500 hover:text-gray-800 underline transition-colors"
                        >
                            ← Voltar para login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
