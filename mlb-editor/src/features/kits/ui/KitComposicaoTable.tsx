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

const str = (v: unknown): string =>
  v == null ? "" : String(v).toLowerCase();

// ── CÁLCULO DO VALOR COMERCIAL (espelho de TabValores.tsx) ────────────────────
// base = Valor Unitário
// com_lucro     = base × (1 + Lucro%)  OU  base + Lucro R$
// com_acrescimo = com_lucro × (1 + Acréscimo%)
// ST            = base × (ST%)  OU  ST R$ fixo
// Valor Comercial = com_acrescimo + ST
function calcularValorComercial(item: EstoqueItem): number {
  const base      = parseFloat(String(item.valorUnitario))               || 0;
  const lucro     = parseFloat(String(item.lucroValor))                  || 0;
  const acrescimo = (parseFloat(String(item.acrescimoPercent))           || 0) / 100;
  const stVal     = parseFloat(String(item.substituicaoTributariaValor)) || 0;

  const comLucro =
    item.lucroTipo === "percent"
      ? base * (1 + lucro / 100)
      : base + lucro;

  const comAcrescimo = comLucro * (1 + acrescimo);

  const st =
    item.substituicaoTributariaTipo === "valor"
      ? stVal
      : base * (stVal / 100);

  return comAcrescimo + st;
}

function DropdownBusca({ valor, itens, onSelecionar, onChangeTexto }: DropdownBuscaProps) {
  const [aberto, setAberto] = useState(false);
  const [query, setQuery] = useState(valor);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(valor); }, [valor]);

  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const termos = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const resultados = termos.length === 0
    ? []
    : itens
        .filter(it => {
          const haystack = [
            str(it.codigoItem),
            str(it.item),
            str(it.referencia),
            str(it.marca),
          ].join(" ");
          return termos.every(termo => haystack.includes(termo));
        })
        .sort((a, b) => {
          const q = query.trim().toLowerCase();
          const aComeca = str(a.item).startsWith(q) ? 0 : 1;
          const bComeca = str(b.item).startsWith(q) ? 0 : 1;
          return aComeca - bComeca;
        })
        .slice(0, 20);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    onChangeTexto(v);
    setAberto(true);
  };

  const handleSelecionar = (item: EstoqueItem) => {
    setQuery(item.item ?? item.codigoItem ?? "");
    onSelecionar(item);
    setAberto(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => termos.length > 0 && setAberto(true)}
        className="w-full h-5 px-1 border border-gray-300 rounded-sm text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Ex: 7150 ret"
        autoComplete="off"
      />

      {aberto && resultados.length > 0 && (
        <div className="absolute z-50 top-full left-0 mt-0.5 w-[520px] bg-white border border-gray-400 shadow-lg">
          <div
            className="grid text-[10px] font-semibold text-gray-500 uppercase bg-[#dcdcdc] border-b border-gray-400"
            style={{ gridTemplateColumns: "120px 1fr auto" }}
          >
            <span className="px-2 py-1">Código</span>
            <span className="px-2 py-1">Item</span>
            <span className="px-2 py-1 text-right w-20">Qtde. Estoque</span>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "280px" }}>
            {resultados.map((item, idx) => (
              <button
                key={item.codigoItem ?? idx}
                onMouseDown={e => { e.preventDefault(); handleSelecionar(item); }}
                className="w-full grid text-left text-[11px] hover:bg-blue-50 border-b border-gray-200 last:border-0 transition-colors"
                style={{ gridTemplateColumns: "120px 1fr auto" }}
              >
                <span className="px-2 py-1.5 font-medium text-gray-800 truncate">
                  {item.codigoItem || <span className="text-gray-400 italic">sem código</span>}
                </span>
                <span className="px-2 py-1.5 text-gray-600 truncate">{item.item || "—"}</span>
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
          </div>
        </div>
      )}

      {aberto && termos.length > 0 && resultados.length === 0 && (
        <div className="absolute z-50 top-full left-0 mt-0.5 w-[520px] bg-white border border-gray-400 shadow-sm px-3 py-2 text-[11px] text-gray-400 italic">
          Nenhum item encontrado.
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
      i === index ? { ...linha, codigoItem: item.item ?? item.codigoItem ?? "" } : linha
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
            <th className="text-left px-2 py-1.5 border border-gray-400 font-semibold">Código / Item</th>
            <th className="text-left px-2 py-1.5 border border-gray-400 font-semibold w-36">Descrição</th>
            <th className="text-center px-2 py-1.5 border border-gray-400 font-semibold w-20">Qtde.</th>
            <th className="text-right px-2 py-1.5 border border-gray-400 font-semibold w-28">Valor Unit.</th>
            <th className="text-right px-2 py-1.5 border border-gray-400 font-semibold w-28">Subtotal</th>
            <th className="w-8 border border-gray-400"></th>
          </tr>
        </thead>
        <tbody>
          {composicao.map((linha, i) => {
            const itemEncontrado = itens.find(
              it => it.item === linha.codigoItem || it.codigoItem === linha.codigoItem
            );
            // Valor Unit. reflete o Valor Comercial calculado do item
            const valorUnit = itemEncontrado ? calcularValorComercial(itemEncontrado) : 0;
            const subtotal  = valorUnit * linha.quantidade;
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
