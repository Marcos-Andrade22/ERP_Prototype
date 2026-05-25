import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../../shared/lib/api";

type CampoMlb = {
  key: string;
  label: string;
};

const CAMPOS_MLB: CampoMlb[] = [
  { key: "ean",          label: "EAN" },
  { key: "cubagem",      label: "Cubagem" },
  { key: "otimizado",    label: "Otimizado" },
  { key: "full",         label: "Full" },
  { key: "patrocinados", label: "Patrocinado" },
  { key: "clipe",        label: "Clipe" },
  { key: "revisado",     label: "Revisado" },
  { key: "foto",         label: "Foto" },
];

type ResultadoMlb = {
  itemId: number;
  item: string;
  marca: string;
  referencia: string;
  quantidade: number;
  quantidadeMinima: number | null;
  setor: string;
  mlbValor: string;
  mlbModelo: string;
};

export default function BuscaMlbPage() {
  const navigate = useNavigate();
  const [selecionados, setSelecionados] = useState<Record<string, boolean | null>>(
    Object.fromEntries(CAMPOS_MLB.map(c => [c.key, null]))
  );
  const [resultados, setResultados] = useState<ResultadoMlb[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const toggleCampo = (key: string, valor: boolean) => {
    setSelecionados(prev => ({
      ...prev,
      [key]: prev[key] === valor ? null : valor,
    }));
  };

  const filtrosAtivos = Object.entries(selecionados).filter(([, v]) => v !== null);

  const handleBuscar = async () => {
    if (filtrosAtivos.length === 0) return;
    setLoading(true);
    setErro(null);
    try {
      const params = Object.fromEntries(
        filtrosAtivos.map(([k, v]) => [k, String(v)])
      );
      const { data } = await api.get("/mlb/buscar", { params });
      setResultados(data.data ?? []);
    } catch {
      setErro("Erro ao buscar. Verifique a conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleLimpar = () => {
    setSelecionados(Object.fromEntries(CAMPOS_MLB.map(c => [c.key, null])));
    setResultados(null);
    setErro(null);
  };

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#d4d0c8" }}>
      {/* Topbar */}
      <div
        className="flex items-center justify-between px-5 py-3 text-white"
        style={{ backgroundColor: "#22252A" }}
      >
        <div>
          <span className="text-base font-bold tracking-widest" style={{ color: "#ee591f" }}>SÓ IMPORTADOS</span>
          <span className="ml-3 text-[11px] opacity-50 tracking-wider">BUSCA POR CAMPOS MLB</span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-[11px] px-3 py-1.5 border border-white/30 hover:bg-white/10 transition-colors"
        >
          ← Voltar
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Painel de filtros */}
        <div className="bg-[#e8f0fe] border-2 border-blue-400 p-4">
          <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-3">
            Selecione os campos e os valores desejados:
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {CAMPOS_MLB.map(({ key, label }) => (
              <div key={key} className="bg-white border border-blue-200 p-3 space-y-2">
                <p className="text-[11px] font-bold text-gray-700 uppercase">{label}</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selecionados[key] === true}
                    onChange={() => toggleCampo(key, true)}
                    className="accent-green-600"
                  />
                  <span className="text-[11px] text-green-700 font-medium">✅ True</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selecionados[key] === false}
                    onChange={() => toggleCampo(key, false)}
                    className="accent-red-600"
                  />
                  <span className="text-[11px] text-red-700 font-medium">❌ False</span>
                </label>
              </div>
            ))}
          </div>

          {filtrosAtivos.length > 0 && (
            <p className="mt-3 text-[11px] text-blue-700">
              Filtros ativos: {filtrosAtivos.map(([k, v]) => `${k} = ${v ? "true" : "false"}`).join(" · ")}
            </p>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleLimpar}
              className="px-4 py-1.5 text-[11px] border border-gray-400 bg-white text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Limpar
            </button>
            <button
              onClick={handleBuscar}
              disabled={filtrosAtivos.length === 0 || loading}
              className="px-6 py-1.5 text-[11px] font-semibold text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: "#ee591f" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#d44d1a")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#ee591f")}
            >
              {loading ? "Buscando..." : "🔍 Buscar"}
            </button>
          </div>
        </div>

        {erro && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-300 px-3 py-2">{erro}</div>
        )}

        {resultados !== null && (
          <div className="bg-[#ececec] border border-gray-400">
            <div
              className="grid px-3 py-2 text-[11px] font-semibold text-white border-b border-gray-400"
              style={{ backgroundColor: "#22252A", gridTemplateColumns: "1fr 100px 120px 80px 70px 70px" }}
            >
              <div>Item</div>
              <div>Marca</div>
              <div>Referência</div>
              <div>MLB</div>
              <div className="text-center">Qtde.</div>
              <div className="text-center">Setor</div>
            </div>

            {resultados.length === 0 && (
              <div className="px-4 py-8 text-center text-xs text-gray-500">
                Nenhum item encontrado para os filtros selecionados.
              </div>
            )}

            {resultados.map((item, index) => (
              <div
                key={item.itemId ?? index}
                onClick={() => navigate(`/estoque/item/${item.itemId}`)}
                className={`grid px-3 py-2 text-[11px] border-b border-gray-200 cursor-pointer transition-colors ${
                  index % 2 === 0 ? "bg-white hover:bg-orange-50" : "bg-[#f5f5f5] hover:bg-orange-50"
                }`}
                style={{ gridTemplateColumns: "1fr 100px 120px 80px 70px 70px" }}
              >
                <div className="font-medium text-gray-900 truncate">{item.item}</div>
                <div className="text-gray-600 truncate">{item.marca || "—"}</div>
                <div className="text-gray-500 truncate">{item.referencia || "—"}</div>
                <div className="text-blue-600 font-mono truncate">{item.mlbValor || "—"}</div>
                <div
                  className="text-center font-semibold tabular-nums"
                  style={{
                    color: item.quantidade === 0 ? "#dc2626"
                      : item.quantidade <= (item.quantidadeMinima ?? 1) ? "#ea580c"
                      : "#15803d",
                  }}
                >
                  {item.quantidade}
                </div>
                <div className="text-center text-gray-500">{item.setor}</div>
              </div>
            ))}

            {resultados.length > 0 && (
              <div className="px-3 py-2 text-[11px] text-gray-500 bg-[#ececec] border-t border-gray-300">
                {resultados.length} item(ns) encontrado(s)
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
