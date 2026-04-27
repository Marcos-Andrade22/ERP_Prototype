import { useEffect, useState } from "react";
import { kitMlbService, parsearMlbBruto } from "../lib/kit-mlb-service";
import type { KitMlbEntry } from "../lib/kit-mlb-service";
import type { Kit } from "../model/Kit";

const FLAGS: { key: keyof KitMlbEntry; label: string }[] = [
  { key: "ean",         label: "EAN" },
  { key: "cubagem",     label: "Cubagem" },
  { key: "otimizado",   label: "Otimizado" },
  { key: "full",        label: "Full" },
  { key: "patrocinados",label: "Patrocin." },
  { key: "clipe",       label: "Clipe" },
  { key: "revisado",    label: "Revisado" },
];

const MLB_VAZIO = (): KitMlbEntry => ({
  valor: "", modelo: "", ean: false, cubagem: false,
  otimizado: false, full: false, patrocinados: false,
  clipe: false, revisado: false,
});

interface Props {
  kit: Kit;
  onFechar: () => void;
}

export function KitMlbModal({ kit, onFechar }: Props) {
  const [lista, setLista] = useState<KitMlbEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const [rawImport, setRawImport] = useState("");
  const [mostrarImport, setMostrarImport] = useState(false);

  useEffect(() => {
    kitMlbService.listar(kit.id).then(data => {
      setLista(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [kit.id]);

  const atualizar = (index: number, campo: keyof KitMlbEntry, valor: unknown) => {
    setLista(prev => prev.map((e, i) => i === index ? { ...e, [campo]: valor } : e));
  };

  const adicionarLinha = () => setLista(prev => [...prev, MLB_VAZIO()]);

  const remover = (index: number) => setLista(prev => prev.filter((_, i) => i !== index));

  const importarRaw = () => {
    const parsed = parsearMlbBruto(rawImport);
    if (parsed.length === 0) {
      setMensagem({ tipo: "erro", texto: "Nenhum código de 10 dígitos encontrado no texto informado." });
      return;
    }
    // Mescla com os existentes, evitando duplicatas por valor
    setLista(prev => {
      const existentes = new Set(prev.map(e => e.valor));
      const novos = parsed.filter(p => !existentes.has(p.valor));
      return [...prev, ...novos];
    });
    setRawImport("");
    setMostrarImport(false);
    setMensagem({ tipo: "ok", texto: `${parsed.length} MLB(s) importado(s) com sucesso.` });
  };

  const salvar = async () => {
    const invalidos = lista.filter(e => !/^\d{10}$/.test(e.valor));
    if (invalidos.length > 0) {
      setMensagem({ tipo: "erro", texto: `${invalidos.length} linha(s) com código inválido (deve ter exatamente 10 dígitos).` });
      return;
    }
    setSalvando(true);
    setMensagem(null);
    try {
      const resultado = await kitMlbService.salvar(kit.id, lista);
      setLista(resultado);
      setMensagem({ tipo: "ok", texto: "MLBs salvos com sucesso." });
    } catch {
      setMensagem({ tipo: "erro", texto: "Erro ao salvar. Verifique a conexão com o servidor." });
    } finally {
      setSalvando(false);
    }
  };

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={e => { if (e.target === e.currentTarget) onFechar(); }}
    >
      <div
        className="bg-white flex flex-col"
        style={{ width: "860px", maxWidth: "95vw", maxHeight: "90vh" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 text-white shrink-0"
          style={{ backgroundColor: "#22252A" }}
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider">Gerenciar MLB</span>
            <span className="ml-3 text-[11px] opacity-50">{kit.nome}</span>
          </div>
          <button onClick={onFechar} className="text-white opacity-60 hover:opacity-100 text-lg leading-none">
            ✕
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#ececec] border-b border-gray-300 shrink-0">
          <button
            onClick={adicionarLinha}
            className="text-[11px] px-3 py-1 border border-gray-400 hover:bg-gray-200 transition-colors"
          >
            + Adicionar linha
          </button>
          <button
            onClick={() => setMostrarImport(v => !v)}
            className="text-[11px] px-3 py-1 border border-blue-400 text-blue-600 hover:bg-blue-50 transition-colors"
          >
            {mostrarImport ? "▲ Fechar importação" : "▼ Importar texto bruto"}
          </button>
          <span className="ml-auto text-[11px] text-gray-500">{lista.length} MLB(s)</span>
        </div>

        {/* Importação por texto bruto */}
        {mostrarImport && (
          <div className="px-4 py-3 bg-[#f5f5f0] border-b border-gray-300 shrink-0 space-y-2">
            <p className="text-[11px] text-gray-600">
              Cole o texto bruto do campo MLB. Apenas códigos de <strong>exatamente 10 dígitos</strong> serão importados.
            </p>
            <textarea
              value={rawImport}
              onChange={e => setRawImport(e.target.value)}
              rows={3}
              placeholder="Ex: 1714432252 TRITON   5498152508 PAJERO dakar  5497844498 PAJERO FULL"
              className="w-full px-2 py-1.5 border border-gray-300 text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
            />
            <button
              onClick={importarRaw}
              className="text-[11px] px-4 py-1.5 font-semibold text-white transition-colors"
              style={{ backgroundColor: "#22252A" }}
            >
              Processar e importar
            </button>
          </div>
        )}

        {/* Tabela */}
        <div className="overflow-auto flex-1">
          {loading ? (
            <div className="p-8 text-center text-[11px] text-gray-400">Carregando...</div>
          ) : lista.length === 0 ? (
            <div className="p-8 text-center text-[11px] text-gray-400">
              Nenhum MLB cadastrado. Adicione uma linha ou importe via texto bruto.
            </div>
          ) : (
            <table className="w-full text-[11px] border-collapse">
              <thead className="sticky top-0">
                <tr style={{ backgroundColor: "#dcdcdc" }}>
                  <th className="text-left px-3 py-2 border border-gray-400 font-semibold w-32">Código MLB</th>
                  <th className="text-left px-3 py-2 border border-gray-400 font-semibold">Modelo</th>
                  {FLAGS.map(f => (
                    <th key={f.key} className="text-center px-2 py-2 border border-gray-400 font-semibold w-16">{f.label}</th>
                  ))}
                  <th className="text-center px-2 py-2 border border-gray-400 font-semibold w-10"></th>
                </tr>
              </thead>
              <tbody>
                {lista.map((entry, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"}>
                    <td className="px-2 py-1 border border-gray-200">
                      <input
                        type="text"
                        maxLength={10}
                        value={entry.valor}
                        onChange={e => atualizar(i, "valor", e.target.value.replace(/\D/g, ""))}
                        className={`w-full h-6 px-1 border text-center font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                          entry.valor.length === 10 ? "border-gray-300" : "border-red-300 bg-red-50"
                        }`}
                        placeholder="0000000000"
                      />
                    </td>
                    <td className="px-2 py-1 border border-gray-200">
                      <input
                        type="text"
                        value={entry.modelo}
                        onChange={e => atualizar(i, "modelo", e.target.value.toUpperCase())}
                        className="w-full h-6 px-1 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="Ex: TRITON, PAJERO FULL"
                      />
                    </td>
                    {FLAGS.map(f => (
                      <td key={f.key} className="px-2 py-1 border border-gray-200 text-center">
                        <input
                          type="checkbox"
                          checked={!!entry[f.key]}
                          onChange={e => atualizar(i, f.key, e.target.checked)}
                          className="cursor-pointer"
                        />
                      </td>
                    ))}
                    <td className="px-2 py-1 border border-gray-200 text-center">
                      <button
                        onClick={() => remover(i)}
                        className="text-red-400 hover:text-red-600 transition-colors font-bold"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[#ececec] border-t border-gray-300 flex items-center gap-3 shrink-0">
          {mensagem && (
            <span className={`text-[11px] ${
              mensagem.tipo === "ok" ? "text-green-700" : "text-red-600"
            }`}>
              {mensagem.texto}
            </span>
          )}
          <div className="ml-auto flex gap-2">
            <button
              onClick={onFechar}
              className="text-[11px] px-4 py-1.5 border border-gray-400 hover:bg-gray-200 transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={salvar}
              disabled={salvando}
              className="text-[11px] px-4 py-1.5 font-semibold text-white disabled:opacity-50 transition-colors"
              style={{ backgroundColor: "#22252A" }}
            >
              {salvando ? "Salvando..." : "Salvar MLBs"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
