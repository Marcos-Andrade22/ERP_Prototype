import type { KitComposicao } from "../model/Kit";
import type { EstoqueItem } from "../../estoque/model/EstoqueItem";

interface Props {
  composicao: KitComposicao[];
  itens: EstoqueItem[];
  onChange: (composicao: KitComposicao[]) => void;
}

export function KitComposicaoTable({ composicao, itens, onChange }: Props) {
  const adicionarLinha = () => {
    onChange([...composicao, { codigoItem: "", quantidade: 1 }]);
  };

  const atualizarLinha = (index: number, campo: keyof KitComposicao, valor: string | number) => {
    const nova = composicao.map((linha, i) =>
      i === index ? { ...linha, [campo]: valor } : linha
    );
    onChange(nova);
  };

  const removerLinha = (index: number) => {
    onChange(composicao.filter((_, i) => i !== index));
  };

  return (
    <div>
      <table className="w-full text-[11px] border-collapse mb-2">
        <thead>
          <tr className="bg-[#dcdcdc]">
            <th className="text-left px-2 py-1.5 border border-gray-400 font-semibold">Código do Item</th>
            <th className="text-left px-2 py-1.5 border border-gray-400 font-semibold w-32">Descrição</th>
            <th className="text-center px-2 py-1.5 border border-gray-400 font-semibold w-20">Qtde.</th>
            <th className="text-right px-2 py-1.5 border border-gray-400 font-semibold w-28">Valor Unit.</th>
            <th className="text-right px-2 py-1.5 border border-gray-400 font-semibold w-28">Subtotal</th>
            <th className="w-8 border border-gray-400"></th>
          </tr>
        </thead>
        <tbody>
          {composicao.map((linha, i) => {
            const itemEncontrado = itens.find(it => it.codigoItem === linha.codigoItem);
            const valorUnit = Number(itemEncontrado?.valorUnitario ?? 0);
            const subtotal = valorUnit * linha.quantidade;
            return (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-2 py-1 border border-gray-300">
                  <input
                    type="text"
                    value={linha.codigoItem}
                    onChange={e => atualizarLinha(i, "codigoItem", e.target.value)}
                    list="lista-codigos"
                    className="w-full h-5 px-1 border border-gray-300 rounded-sm text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Ex: RET-001"
                  />
                </td>
                <td className="px-2 py-1 border border-gray-300 text-gray-500">
                  {itemEncontrado?.item ?? <span className="text-red-400">não encontrado</span>}
                </td>
                <td className="px-2 py-1 border border-gray-300">
                  <input
                    type="number"
                    min={1}
                    value={linha.quantidade}
                    onChange={e => atualizarLinha(i, "quantidade", Math.max(1, Number(e.target.value)))}
                    className="w-full h-5 px-1 border border-gray-300 rounded-sm text-[11px] text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-1 border border-gray-300 text-right tabular-nums">
                  {valorUnit.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>
                <td className="px-2 py-1 border border-gray-300 text-right tabular-nums font-medium">
                  {subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>
                <td className="px-2 py-1 border border-gray-300 text-center">
                  <button
                    onClick={() => removerLinha(i)}
                    className="text-red-400 hover:text-red-600 font-bold transition-colors"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* datalist para autocomplete de códigos */}
      <datalist id="lista-codigos">
        {itens.map(it => (
          <option key={it.codigoItem} value={it.codigoItem}>{it.item}</option>
        ))}
      </datalist>

      <button
        onClick={adicionarLinha}
        className="text-[11px] px-3 py-1 border border-gray-400 hover:bg-gray-200 transition-colors"
      >
        + Adicionar item
      </button>
    </div>
  );
}
