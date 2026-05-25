import { useEffect, useState } from "react";
import { useMlb } from "../features/estoque/lib/useMlb";
import { parsearMlbBruto, type MlbEntryInput } from "../shared/lib/mlb-service";

const FLAGS: { key: keyof Omit<MlbEntryInput, "valor" | "modelo">; label: string }[] = [
  { key: "ean",          label: "EAN" },
  { key: "cubagem",      label: "Cubagem" },
  { key: "otimizado",    label: "Otimizado" },
  { key: "full",         label: "Full" },
  { key: "patrocinados", label: "Patrocin." },
  { key: "clipe",        label: "Clipe" },
  { key: "revisado",     label: "Revisado" },
  { key: "foto",         label: "Foto" },
];

const MLB_VAZIO = (): MlbEntryInput => ({
  valor: "",
  modelo: "",
  ean: false,
  cubagem: false,
  otimizado: false,
  full: false,
  patrocinados: false,
  clipe: false,
  revisado: false,
  foto: false,
});

interface Props {
  itemId: number;
  nomeItem?: string;
}

export default function MlbTable({ itemId, nomeItem }: Props) {
  const { mlbs, loading: loadingInicial, salvar } = useMlb({ itemId });

  const [lista, setLista] = useState<MlbEntryInput[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const [rawImport, setRawImport] = useState("");
  const [mostrarImport, setMostrarImport] = useState(false);

  useEffect(() => {
    setLista(mlbs.map(({ id: _id, itemId: _iid, kitId: _kid, ...rest }) => rest));
  }, [mlbs]);

  const atualizar = (index: number, campo: keyof MlbEntryInput, valor: unknown) => {
    setLista(prev => prev.map((e, i) => i === index ? { ...e, [campo]: valor } : e));
  };

  const adicionarLinha = () => setLista(prev => [...prev, MLB_VAZIO()]);
  const remover = (index: number) => setLista(prev => prev.filter((_, i) => i !== index));

  const importarRaw = () => {
    const parsed = parsearMlbBruto(rawImport);
    if (parsed.length === 0) {
      setMensagem({ tipo: "erro", texto: "Nenhum código de 10 dígitos encontrado." });
      return;
    }
    setLista(prev => {
      const existentes = new Set(prev.map(e => e.valor));
      return [...prev, ...parsed.filter(p => !existentes.has(p.valor))];
    });
    setRawImport("");
    setMostrarImport(false);
    setMensagem({ tipo: "ok", texto: `${parsed.length} MLB(s) importado(s).` });
  };

  const handleSalvar = async () => {
    const invalidos = lista.filter(e => !/^\d{10}$/.test(e.valor));
    if (invalidos.length > 0) {
      setMensagem({ tipo: "erro", texto: `${invalidos.length} linha(s) com código inválido.` });
      return;
    }
    setSalvando(true);
    setMensagem(null);
    try {
      await salvar(lista);
      setMensagem({ tipo: "ok", texto: "MLBs salvos com sucesso." });
    } catch {
      setMensagem({ tipo: "erro", texto: "Erro ao salvar. Verifique a conexão." });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-[11px] px-3 py-1 border border-green-600 text-green-700 hover:bg-green-50 transition-colors font-semibold"
      >
        {loadingInicial ? "Carregando..." : "Gerenciar MLB"}
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={e => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div className="bg-white flex flex-col" style={{ width: "960px", maxWidth: "95vw", maxHeight: "90vh" }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 text-white shrink-0" style={{ backgroundColor: "#22252A" }}>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider">Gerenciar MLB</span>
                {nomeItem && <span className="ml-3 text-[11px] opacity-50">{nomeItem}</span>}
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white opacity-60 hover:opacity-100 text-lg leading-none">✕</button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#ececec] border-b border-gray-300 shrink-0">
              <button onClick={adicionarLinha} className="text-[11px] px-3 py-1 border border-gray-400 hover:bg-gray-200 transition-colors">+ Adicionar linha</button>
              <button onClick={() => setMostrarImport(v => !v)} className="text-[11px] px-3 py-1 border border-blue-400 text-blue-600 hover:bg-blue-50 transition-colors">
                {mostrarImport ? "▲ Fechar importação" : "▼ Importar texto bruto"}
              </button>
              <span className="ml-auto text-[11px] text-gray-500">{lista.length} MLB(s)</span>
            </div>

            {/* Importação */}
            {mostrarImport && (
              <div className="px-4 py-3 bg-[#f5f5f0] border-b border-gray-300 shrink-0 space-y-2">
                <p className="text-[11px] text-gray-600">Cole o texto bruto. Códigos de <strong>exatamente 10 dígitos</strong> serão extraídos; o texto após cada código vira o campo Modelo.</p>
                <textarea
                  value={rawImport}
                  onChange={e => setRawImport(e.target.value)}
                  rows={3}
                  placeholder="Ex: 1714432252 TRITON   5498152508 PAJERO FULL"
                  className="w-full px-2 py-1.5 border border-gray-300 text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
                />
                <button onClick={importarRaw} className="text-[11px] px-4 py-1.5 font-semibold text-white transition-colors" style={{ backgroundColor: "#22252A" }}>Processar e importar</button>
              </div>
            )}

            {/* Feedback */}
            {mensagem && (
              <div className={`px-4 py-2 text-[11px] shrink-0 ${mensagem.tipo === "ok" ? "bg-green-50 text-green-700 border-b border-green-200" : "bg-red-50 text-red-700 border-b border-red-200"}`}>
                {mensagem.texto}
              </div>
            )}

            {/* Tabela */}
            <div className="overflow-auto flex-1">
              <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr className="bg-[#dcdcdc] text-gray-700">
                    <th className="text-left px-3 py-2 border-b border-gray-300 font-semibold w-36">MLB</th>
                    <th className="text-left px-3 py-2 border-b border-gray-300 font-semibold w-36">Modelo</th>
                    {FLAGS.map(f => (
                      <th key={f.key} className="text-center px-2 py-2 border-b border-gray-300 font-semibold w-20">{f.label}</th>
                    ))}
                    <th className="text-center px-2 py-2 border-b border-gray-300 font-semibold w-16">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.length === 0 && (
                    <tr><td colSpan={FLAGS.length + 3} className="text-center py-8 text-gray-400 text-[11px]">Nenhum MLB cadastrado. Use "+ Adicionar linha" ou importe um texto bruto.</td></tr>
                  )}
                  {lista.map((entry, index) => {
                    const invalido = entry.valor !== "" && !/^\d{10}$/.test(entry.valor);
                    return (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-2 py-1">
                          <input
                            type="text" value={entry.valor}
                            onChange={e => atualizar(index, "valor", e.target.value)}
                            maxLength={10}
                            className={`w-full px-2 py-1 border text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-blue-400 ${invalido ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                            placeholder="10 dígitos"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="text" value={entry.modelo}
                            onChange={e => atualizar(index, "modelo", e.target.value.toUpperCase())}
                            className="w-full px-2 py-1 border border-gray-300 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-400"
                            placeholder="Ex: TRITON"
                          />
                        </td>
                        {FLAGS.map(f => (
                          <td key={f.key} className="px-2 py-1 text-center">
                            <input type="checkbox" checked={entry[f.key] as boolean} onChange={e => atualizar(index, f.key, e.target.checked)} className="w-3.5 h-3.5 cursor-pointer" />
                          </td>
                        ))}
                        <td className="px-2 py-1 text-center">
                          <button onClick={() => remover(index)} className="text-red-500 hover:text-red-700 transition-colors text-[11px]" title="Remover">✕</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-4 py-3 bg-[#ececec] border-t border-gray-300 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="text-[11px] px-4 py-1.5 border border-gray-400 hover:bg-gray-200 transition-colors">Fechar</button>
              <button onClick={handleSalvar} disabled={salvando} className="text-[11px] px-4 py-1.5 font-semibold text-white transition-colors disabled:opacity-50" style={{ backgroundColor: "#22252A" }}>
                {salvando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
