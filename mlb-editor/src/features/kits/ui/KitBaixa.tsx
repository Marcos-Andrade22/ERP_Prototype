import { useState } from "react";
import type { Kit } from "../model/Kit";
import type { EstoqueItem } from "../../estoque/model/EstoqueItem";
import { calcularQuantidadeDisponivelKit } from "../lib/kit-disponibilidade";
import { itensService } from "../../estoque/lib/item-service";

interface Props {
  kit: Kit;
  itens: EstoqueItem[];
  onBaixaRealizada: () => void;
}

export function KitBaixa({ kit, itens, onBaixaRealizada }: Props) {
  const [quantidade, setQuantidade] = useState(1);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  const qtdeDisponivel = calcularQuantidadeDisponivelKit(kit, itens);

  const handleBaixar = async () => {
    if (quantidade <= 0) return;
    if (quantidade > qtdeDisponivel) {
      setMensagem({ tipo: "erro", texto: `Estoque insuficiente. Máximo disponível: ${qtdeDisponivel}` });
      return;
    }

    setSalvando(true);
    setMensagem(null);

    try {
      for (const linha of kit.composicao) {
        const itemEstoque = itens.find(
          i => String(i.item) === linha.codigoItem || String(i.codigoItem) === linha.codigoItem
        );
        if (!itemEstoque?.id) continue;

        const novaQtde = Math.max(0, itemEstoque.quantidade - linha.quantidade * quantidade);
        // Envia apenas o campo alterado — Partial<EstoqueItem> agora aceito pelo service
        await itensService.atualizar(itemEstoque.id, { quantidade: novaQtde });
      }

      setMensagem({
        tipo: "ok",
        texto: `Baixa de ${quantidade} ${quantidade === 1 ? "kit" : "kits"} realizada com sucesso.`,
      });
      setQuantidade(1);
      onBaixaRealizada();
    } catch {
      setMensagem({ tipo: "erro", texto: "Erro ao registrar baixa. Verifique a conexão com o servidor." });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="bg-[#ececec] border border-gray-400">
      <div
        className="flex items-center px-4 py-2 text-white"
        style={{ backgroundColor: "#22252A" }}
      >
        <span className="text-[11px] font-semibold uppercase tracking-wider">Dar Baixa no Kit</span>
      </div>

      <div className="p-4 space-y-3">
        {/* Resumo de disponibilidade */}
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-gray-600">Qtde. disponível:</span>
          <span className={`font-bold tabular-nums text-sm ${
            qtdeDisponivel === 0
              ? "text-red-600"
              : qtdeDisponivel <= 3
              ? "text-orange-500"
              : "text-green-700"
          }`}>
            {qtdeDisponivel} {qtdeDisponivel === 1 ? "kit" : "kits"}
          </span>
        </div>

        {/* Tabela de impacto */}
        <div>
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Impacto no estoque</p>
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-[#dcdcdc]">
                <th className="text-left px-2 py-1.5 border border-gray-400 font-semibold">Item</th>
                <th className="text-center px-2 py-1.5 border border-gray-400 font-semibold">Atual</th>
                <th className="text-center px-2 py-1.5 border border-gray-400 font-semibold">Por Kit</th>
                <th className="text-center px-2 py-1.5 border border-gray-400 font-semibold">Total baixa</th>
                <th className="text-center px-2 py-1.5 border border-gray-400 font-semibold">Saldo final</th>
              </tr>
            </thead>
            <tbody>
              {kit.composicao.map((linha, i) => {
                const itemEstoque = itens.find(
                  it => String(it.item) === linha.codigoItem || String(it.codigoItem) === linha.codigoItem
                );
                const atual = itemEstoque?.quantidade ?? 0;
                const totalBaixa = linha.quantidade * quantidade;
                const saldoFinal = Math.max(0, atual - totalBaixa);
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-2 py-1.5 border border-gray-300">{linha.codigoItem}</td>
                    <td className="px-2 py-1.5 border border-gray-300 text-center tabular-nums">{atual}</td>
                    <td className="px-2 py-1.5 border border-gray-300 text-center tabular-nums">−{linha.quantidade}</td>
                    <td className="px-2 py-1.5 border border-gray-300 text-center tabular-nums text-red-600 font-semibold">−{totalBaixa}</td>
                    <td className={`px-2 py-1.5 border border-gray-300 text-center tabular-nums font-semibold ${
                      saldoFinal === 0 ? "text-red-600" : saldoFinal <= 3 ? "text-orange-500" : "text-green-700"
                    }`}>
                      {saldoFinal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Input de quantidade + botão */}
        <div className="flex items-center gap-3">
          <label className="text-[11px] text-gray-600">Quantidade a baixar:</label>
          <input
            type="number"
            min={1}
            max={qtdeDisponivel}
            value={quantidade}
            onChange={e => setQuantidade(Math.max(1, Number(e.target.value)))}
            disabled={qtdeDisponivel === 0}
            className="w-20 h-6 px-1 border border-gray-300 rounded-sm text-[11px] text-center focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={handleBaixar}
            disabled={salvando || qtdeDisponivel === 0}
            className="px-4 py-1.5 text-[11px] font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: qtdeDisponivel === 0 ? "#9ca3af" : "#22252A" }}
          >
            {salvando ? "Salvando..." : "Confirmar Baixa"}
          </button>
        </div>

        {/* Feedback */}
        {mensagem && (
          <div className={`text-[11px] px-3 py-2 border ${
            mensagem.tipo === "ok"
              ? "bg-green-50 border-green-300 text-green-700"
              : "bg-red-50 border-red-300 text-red-600"
          }`}>
            {mensagem.texto}
          </div>
        )}
      </div>
    </div>
  );
}
