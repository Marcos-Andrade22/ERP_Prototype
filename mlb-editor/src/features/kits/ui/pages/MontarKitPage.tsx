import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useKits } from "../../lib/useKits";
import { useItensTodos } from "../../lib/useItensTodos";
import { KitList } from "../KitList";
import { KitForm } from "../KitForm";
import { KitBaixa } from "../KitBaixa";
import { KitMlbModal } from "../KitMlbModal";
import type { Kit } from "../../model/Kit";

export default function MontarKitPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { kits, loading, error, criar, atualizar, deletar } = useKits();
  const { itens: itensTodos, loading: loadingItens, recarregar } = useItensTodos();

  const [modo, setModo] = useState<"lista" | "novo" | "editar">("lista");
  const [kitEditando, setKitEditando] = useState<Kit | null>(null);
  const [kitMlb, setKitMlb] = useState<Kit | null>(null);

  useEffect(() => {
    const idParam = searchParams.get("editar");
    if (!idParam || kits.length === 0) return;
    const kit = kits.find(k => String(k.id) === idParam);
    if (kit) {
      setKitEditando(kit);
      setModo("editar");
    }
  }, [searchParams, kits]);

  const handleEditar = (kit: Kit) => {
    setKitEditando(kit);
    setModo("editar");
  };

  const handleDeletar = async (id: string) => {
    if (!confirm("Deseja excluir este kit?")) return;
    await deletar(id);
  };

  const handleSalvar = async (dados: Omit<Kit, "id" | "valorCalculado">) => {
    if (modo === "editar" && kitEditando) {
      await atualizar(kitEditando.id, dados);
    } else {
      await criar(dados);
    }
    setModo("lista");
    setKitEditando(null);
  };

  const handleCancelar = () => {
    setModo("lista");
    setKitEditando(null);
  };

  const handleBaixaRealizada = () => {
    recarregar();
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
          <span className="ml-3 text-[11px] opacity-50 tracking-wider">KITS</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/estoque")}
            className="text-[11px] px-3 py-1.5 border border-white/30 hover:bg-white/10 transition-colors"
          >
            ← Estoque
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-[11px] px-3 py-1.5 border border-white/30 hover:bg-white/10 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Lista de kits */}
        <div className="bg-[#ececec] border border-gray-400">
          <div
            className="flex items-center justify-between px-4 py-2 text-white"
            style={{ backgroundColor: "#22252A" }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider">Kits Cadastrados</span>
            {modo === "lista" && (
              <button
                onClick={() => setModo("novo")}
                className="text-[11px] px-3 py-1 border border-white/30 hover:bg-white/10 transition-colors"
              >
                + Novo Kit
              </button>
            )}
          </div>

          <div className="bg-white">
            {loading && (
              <div className="px-4 py-8 text-center text-[11px] text-gray-400">Carregando kits...</div>
            )}
            {error && (
              <div className="px-4 py-4 text-center text-[11px] text-red-600 border-b border-red-200 bg-red-50">{error}</div>
            )}
            {!loading && modo === "lista" && (
              <KitList
                kits={kits}
                itens={itensTodos}
                onEditar={handleEditar}
                onDeletar={handleDeletar}
                onGerenciarMlb={setKitMlb}
              />
            )}
          </div>
        </div>

        {/* Formulário de novo/editar */}
        {(modo === "novo" || modo === "editar") && (
          loadingItens ? (
            <div className="bg-[#ececec] border border-gray-400 px-4 py-6 text-center text-[11px] text-gray-400">
              Carregando itens do estoque...
            </div>
          ) : (
            <>
              <KitForm
                kitInicial={kitEditando ?? undefined}
                itens={itensTodos}
                onSalvar={handleSalvar}
                onCancelar={handleCancelar}
              />
              {modo === "editar" && kitEditando && (
                <KitBaixa
                  kit={kitEditando}
                  itens={itensTodos}
                  onBaixaRealizada={handleBaixaRealizada}
                />
              )}
            </>
          )
        )}
      </div>

      {/* Modal MLB */}
      {kitMlb && (
        <KitMlbModal
          kit={kitMlb}
          onFechar={() => setKitMlb(null)}
        />
      )}
    </div>
  );
}
