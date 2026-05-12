import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { entrar } = useAuth();
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleEntrar = () => {
    const ok = entrar(senha);
    if (ok) {
      navigate("/dashboard");
    } else {
      setErro(true);
      setSenha("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleEntrar();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-sans"
      style={{ backgroundColor: "#d4d0c8" }}
    >
      <div className="w-full max-w-sm">
        <div
          className="px-6 py-4 text-white text-center"
          style={{ backgroundColor: "#22252A" }}
        >
          <span
            className="text-2xl font-bold tracking-widest"
            style={{ color: "#ee591f" }}
          >
            SÓ IMPORTADOS
          </span>
          <p className="text-xs opacity-60 mt-1 tracking-wider">SISTEMA ERP</p>
        </div>

        <div className="bg-[#ececec] border border-gray-400 px-6 py-6 space-y-4">
          <h1 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Acesso ao sistema
          </h1>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
              Senha
            </label>
            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  setErro(false);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Digite a senha de acesso"
                className={`w-full border bg-white px-3 py-2 pr-9 text-xs focus:outline-none focus:border-orange-500 ${
                  erro ? "border-red-500" : "border-gray-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                tabIndex={-1}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {erro && (
              <p className="text-[11px] text-red-600 font-medium">
                Senha incorreta. Tente novamente.
              </p>
            )}
          </div>

          <button
            onClick={handleEntrar}
            className="w-full py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#ee591f" }}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
