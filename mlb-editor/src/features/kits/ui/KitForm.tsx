import { useState } from "react";
import type { Kit, KitComposicao } from "../model/Kit";
import type { EstoqueItem } from "../../estoque/model/EstoqueItem";
import { KitComposicaoTable } from "./KitComposicaoTable";
import { KitMlbModal } from "./KitMlbModal";
import { calcularValorKit } from "../lib/kit-calc";

const TIPOS: Kit["tipo"][] = ["kit", "jogo", "par", "unidade"];

interface Props {
  kitInicial?: Kit;
  itens: EstoqueItem[];
  onSalvar: (kit: Omit<Kit, "id" | "valorCalculado">) => Promise<void>;
  onCancelar: () => void;
}

export function KitForm({ kitInicial, itens, onSalvar, onCancelar }: Props) {
  const [nome, setNome] = useState(kitInicial?.nome ?? "");
  const [tipo, setTipo] = useState<Kit["tipo"]>(kitInicial?.tipo ?? "kit");
  const [composicao, setComposicao] = useState<KitComposicao[]>(kitInicial?.composicao ?? []);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mlbAberto, setMlbAberto] = useState(false);

  const kitPreview: Kit = { id: "", nome, tipo, composicao };
  const valorTotal = calcularValorKit(kitPreview, itens);

  const handleSalvar = async () => {
    if (!nome.trim()) { setErro("O nome do kit é obrigatório."); return; }
    if (composicao.length === 0) { setErro("Adicione ao menos um item."); return; }
    const semCodigo = composicao.some(c => !c.codigoItem.trim());
    if (semCodigo) { setErro("Todos os itens precisam ter um código."); return; }

    try {
      setSalvando(true);
      setErro(null);
      await onSalvar({ nome: nome.trim(), tipo, composicao });
    } catch {
      setErro("Erro ao salvar o kit. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <div className="bg-[#ececec] border border-gray-400">
        {/* Cabeçalho do form */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#dcdcdc] border-b border-gray-400">
          <span className="text-[11px] font-semibold text-gray-700">
            {kitInicial ? `Editando: ${kitInicial.nome}` : "Novo Kit"}
          </span>
          <div className="flex items-center gap-2">
            {/* Botão MLB — só visível ao editar um kit já existente */}
            {kitInicial && (
              <button
                onClick={() => setMlbAberto(true)}
                className="text-[11px] px-3 py-1 border border-purple-400 text-purple-600 hover:bg-purple-50 transition-colors font-semibold"
              >
                Gerenciar MLB
              </button>
            )}
            <button onClick={onCancelar} className="text-[11px] text-gray-500 hover:text-gray-700 transition-colors">
              Cancelar
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Nome e Tipo */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Nome do Kit *</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="w-full h-6 px-2 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ex: Kit Retentor Dianteiro Gol"
              />
            </div>
            <div className="w-36">
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Tipo *</label>
              <select
                value={tipo}
                onChange={e => setTipo(e.target.value as Kit["tipo"])}
                className="w-full h-6 px-2 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                {TIPOS.map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Composição */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-2">Composição *</label>
            <KitComposicaoTable composicao={composicao} itens={itens} onChange={setComposicao} />
          </div>

          {/* Valor total calculado */}
          <div className="flex justify-end">
            <span className="text-[11px] text-gray-500 mr-2">Valor total calculado:</span>
            <span className="text-[11px] font-bold tabular-nums">
              {valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          </div>

          {/* Erro */}
          {erro && (
            <div className="text-[11px] text-red-600 border border-red-300 bg-red-50 px-3 py-2 rounded-sm">
              {erro}
            </div>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-300">
            <button
              onClick={onCancelar}
              className="text-[11px] px-4 py-1.5 border border-gray-400 hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              disabled={salvando}
              className="text-[11px] px-4 py-1.5 border border-blue-500 text-blue-700 hover:bg-blue-50 disabled:opacity-50 transition-colors font-semibold"
            >
              {salvando ? "Salvando..." : kitInicial ? "Salvar alterações" : "Criar Kit"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal MLB — renderizado fora do card para não herdar overflow */}
      {kitInicial && mlbAberto && (
        <KitMlbModal
          kit={kitInicial}
          onFechar={() => setMlbAberto(false)}
        />
      )}
    </>
  );
}
