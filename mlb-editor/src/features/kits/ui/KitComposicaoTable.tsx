import { useState, useRef, useEffect } from "react";
import type { KitComposicao } from "../model/Kit";
import type { EstoqueItem } from "../../estoque/model/EstoqueItem";

interface Props {
  composicao: KitComposicao[];
  itens: EstoqueItem[];
  onChange: (composicao: KitComposicao[]) => void;
}

interface DropdownBuscaProps {
  valor: string;
  itens: EstoqueItem[];
  onSelecionar: (item: EstoqueItem) => void;
  onChangeTexto: (texto: string) => void;
}

function DropdownBusca({ valor, itens, onSelecionar, onChangeTexto }: DropdownBuscaProps) {
  const [aberto, setAberto] = useState(false);
  const [query, setQuery] = useState(valor);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sincroniza query quando valor externo muda (ex: editar kit existente)
  useEffect(() => { setQuery(valor); }, [valor]);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const resultados = query.trim().length === 0
    ? []
    : itens
        .filter(it =>
          it.codigoItem.toLowerCase().includes(query.toLowerCase()) ||
          it.referencia?.toLowerCase().includes(query.toLowerCase()) ||
          it.item?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 10);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    onChangeTexto(v);
    setAberto(true);
  };

  const handleSelecionar = (item: EstoqueItem) => {
    setQuery(item.codigoItem);
    onSelecionar(item);
    setAberto(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => query.trim().length > 0 && setAberto(true)}
        className="w-full h-5 px-1 border border-gray-300 rounded-sm text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Ex: RET-001"
        autoComplete="off"
      />

      {aberto && resultados.length > 0 && (
        <div className="absolute z-50 top-full left-0 mt-0.5 w-[420px] bg-white border border-gray-400 shadow-lg">
          {/* Cabeçalho */}
          <div className="grid text-[10px] font-semibold text-gray-500 uppercase bg-[#dcdcdc] border-b border-gray-400"
            style={{ gridTemplateColumns: "1fr 1fr auto" }}
          >
            <span className="px-2 py-1">Código</span>
            <span className="px-2 py-1">Referência</span>
            <span className="px-2 py-1 text-right w-20">Qtde. Estoque</span>
          </div>

          {/* Resultados */}
          {resultados.map(item => (
            <button
              key={item.codigoItem}
              onMouseDown={e => { e.preventDefault(); handleSelecionar(item); }}
              className="w-full grid text-left text-[11px] hover:bg-blue-50 border-b border-gray-200 last:border-0 transition-colors"
              style={{ gridTemplateColumns: "1fr 1fr auto" }}
            >
              <span className="px-2 py-1.5 font-medium text-gray-800 truncate">{item.codigoItem}</span>
              <span className="px-2 py-1.5 text-gray-500 truncate">{item.referencia || —}</span>
              <span className={`px-2 py-1.5 text-right w-20 tabular-nums font-semibold ${
                item.quantidade <= 0
                  ? "text-red-500"
                  : item.quantidade <= (item.quantidadeMinima ?? 0)
                  ? "text-orange-500"
                  : "text-green-700"
              }`}>
                {item.quantidade}
              </span>
            </button>
          ))}

          {/* Nenhum resultado */}
          {resultados.length === 0 && query.trim().length > 0 && (
            <div className="px-3 py-2 text-[11px] text-gray-400 italic">Nenhum item encontrado.</div>
          )}
        </div>
      )}
    </div>
  );
}

export function KitComposicaoTable({ composicao, itens, onChange }: Props) {
  const adicionarLinha = () => {
    onChange([...composicao, { codigoItem: "", quantidade: 1 }]);
  };

  const atualizarLinha = (index: number, campo: keyof KitComposicao, valor: string | number) => {
    onChange(composicao.map((linha, i) =>
      i === index ? { ...linha, [campo]: valor } : linha
    ));
  };

  const selecionarItem = (index: number, item: EstoqueItem) => {
    onChange(composicao.map((linha, i) =>
      i === index ? { ...linha, codigoItem: item.codigoItem } : linha
    ));
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
            <th className="text-left px-2 py-1.5 border border-gray-400 font-semibold w-36">Descrição</th>
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
                  <DropdownBusca
                    valor={linha.codigoItem}
                    itens={itens}
                    onSelecionar={item => selecionarItem(i, item)}
                    onChangeTexto={texto => atualizarLinha(i, "codigoItem", texto)}
                  />
                </td>
                <td className="px-2 py-1 border border-gray-300 text-gray-500">
                  {itemEncontrado
                    ? itemEncontrado.item
                    : linha.codigoItem
                    ? <span className="text-red-400">não encontrado</span>
                    : null
                  }
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

      <button
        onClick={adicionarLinha}
        className="text-[11px] px-3 py-1 border border-gray-400 hover:bg-gray-200 transition-colors"
      >
        + Adicionar item
      </button>
    </div>
  );
}
