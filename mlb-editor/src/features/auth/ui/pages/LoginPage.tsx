import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { entrar } = useAuth();
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);

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
        {/* Header */}
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

        {/* Form card */}
        <div className="bg-[#ececec] border border-gray-400 px-6 py-6 space-y-4">
          <h1 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Acesso ao sistema
          </h1>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                setErro(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Digite a senha de acesso"
              className={`w-full border bg-white px-3 py-2 text-xs focus:outline-none focus:border-orange-500 ${
                erro ? "border-red-500" : "border-gray-400"
              }`}
            />
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
