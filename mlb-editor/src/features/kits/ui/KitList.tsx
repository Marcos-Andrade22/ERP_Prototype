import type { Kit } from "../model/Kit";
import type { EstoqueItem } from "../../estoque/model/EstoqueItem";
import { calcularValorKit } from "../lib/kit-calc";
import { validarEstoqueKit } from "../lib/kit-balance";

const TIPO_LABEL: Record<string, string> = {
  kit: "Kit",
  combo: "Combo",
  jogo: "Jogo",
  par: "Par",
};

interface Props {
  kits: Kit[];
  itens: EstoqueItem[];
  onEditar: (kit: Kit) => void;
  onDeletar: (id: string) => void;
}

export function KitList({ kits, itens, onEditar, onDeletar }: Props) {
  if (kits.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-[11px] text-gray-400">
        Nenhum kit cadastrado. Clique em "Novo Kit" para começar.
      </div>
    );
  }

  return (
    <table className="w-full text-[11px] border-collapse">
      <thead>
        <tr className="bg-[#dcdcdc] text-gray-700">
          <th className="text-left px-3 py-2 border border-gray-400 font-semibold">Nome</th>
          <th className="text-left px-3 py-2 border border-gray-400 font-semibold">Tipo</th>
          <th className="text-left px-3 py-2 border border-gray-400 font-semibold">Itens</th>
          <th className="text-right px-3 py-2 border border-gray-400 font-semibold">Valor Total</th>
          <th className="text-center px-3 py-2 border border-gray-400 font-semibold">Estoque OK?</th>
          <th className="text-center px-3 py-2 border border-gray-400 font-semibold w-24">Ações</th>
        </tr>
      </thead>
      <tbody>
        {kits.map((kit) => {
          const valor = calcularValorKit(kit, itens);
          const estoqueOk = validarEstoqueKit(kit, 1, itens);
          return (
            <tr key={kit.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-1.5 border border-gray-300 font-medium">{kit.nome}</td>
              <td className="px-3 py-1.5 border border-gray-300">{TIPO_LABEL[kit.tipo] ?? kit.tipo}</td>
              <td className="px-3 py-1.5 border border-gray-300 text-gray-600">
                {kit.composicao.map(c => `${c.codigoItem} × ${c.quantidade}`).join(", ")}
              </td>
              <td className="px-3 py-1.5 border border-gray-300 text-right tabular-nums">
                {valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </td>
              <td className="px-3 py-1.5 border border-gray-300 text-center">
                <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-semibold ${
                  estoqueOk ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                }`}>
                  {estoqueOk ? "✓ OK" : "✗ Insuf."}
                </span>
              </td>
              <td className="px-3 py-1.5 border border-gray-300">
                <div className="flex justify-center gap-1">
                  <button
                    onClick={() => onEditar(kit)}
                    className="px-2 py-0.5 border border-blue-400 text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDeletar(kit.id)}
                    className="px-2 py-0.5 border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
