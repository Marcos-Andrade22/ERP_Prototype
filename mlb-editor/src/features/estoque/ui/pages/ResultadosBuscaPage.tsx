import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { itensService } from "../../lib/item-service";
import { kitsService } from "../../../kits/lib/kits-service";
import { calcularQuantidadeDisponivelKit } from "../../../kits/lib/kit-disponibilidade";
import { calcularValorKit } from "../../../kits/lib/kit-calc";
import type { EstoqueItem } from "../../model/EstoqueItem";
import type { Kit } from "../../../kits/model/Kit";

// Linha genérica da tabela — pode ser item físico ou kit virtual
type LinhaEstoque = {
  id?: number;
  isKit?: boolean;
  kitId?: string;
  codigoItem: string;
  item: string;
  marca: string;
  referencia: string;
  quantidade: number;
  quantidadeMinima?: number;
  setor: string;
  valor?: string;
};

const kitParaLinha = (kit: Kit, itens: EstoqueItem[]): LinhaEstoque => ({
  isKit: true,
  kitId: String(kit.id),
  codigoItem: "",
  item: kit.nome,
  marca: "",
  referencia: kit.tipo,
  quantidade: calcularQuantidadeDisponivelKit(kit, itens),
  quantidadeMinima: 1,
  setor: "KIT",
  valor: calcularValorKit(kit, itens).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
});

export default function ResultadosBuscaPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [itensRaw, setItensRaw] = useState<EstoqueItem[]>([]);
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const buscar = async () => {
      setLoading(true);
      setErro(null);
      try {
        const filtros = Object.fromEntries(searchParams.entries());

        // Busca itens e kits em paralelo
        const [resItens, resKits] = await Promise.all([
          itensService.listar({ ...filtros, limit: 100 }),
          kitsService.listar(),
        ]);

        setItensRaw(resItens.data ?? []);
        setKits(resKits ?? []);
      } catch {
        setErro("Erro ao buscar itens. Verifique a conexão com o servidor.");
      } finally {
        setLoading(false);
      }
    };
    buscar();
  }, [searchParams]);

  const filtrosAtivos = Array.from(searchParams.entries());
  const query = filtrosAtivos.map(([, v]) => v.toLowerCase()).join(" ");

  // Filtra kits pelo nome se houver query ativa
  const kitsFiltrados = query
    ? kits.filter(k => k.nome.toLowerCase().includes(query))
    : kits;

  // Mescla itens físicos + kits virtuais
  // Kits aparecem no topo, separados visualmente
  const linhasKits: LinhaEstoque[] = kitsFiltrados.map(k => kitParaLinha(k, itensRaw));
  const linhasItens: LinhaEstoque[] = itensRaw.map(item => ({
    id: item.id,
    codigoItem: item.codigoItem ?? "",
    item: item.item ?? "",
    marca: item.marca ?? "",
    referencia: item.referencia ?? "",
    quantidade: item.quantidade,
    quantidadeMinima: item.quantidadeMinima,
    setor: item.setor ?? "",
  }));

  const resultados: LinhaEstoque[] = [...linhasKits, ...linhasItens];

  const handleClick = (linha: LinhaEstoque) => {
    if (linha.isKit) {
      navigate(`/kits?editar=${linha.kitId}`);
    } else {
      navigate(`/estoque/item/${linha.id}`);
    }
  };

  return (
    <div className="min-h-screen p-4 space-y-3 font-sans" style={{ backgroundColor: "#d4d0c8" }}>
      <div
        className="flex items-center gap-3 px-4 py-3 text-white"
        style={{ backgroundColor: "#22252A" }}
      >
        <span className="text-lg font-bold" style={{ color: "#ee591f" }}>📋</span>
        <div>
          <p className="text-sm font-semibold">RESULTADOS DA BUSCA</p>
          <p className="text-[11px] opacity-70">
            {filtrosAtivos.map(([k, v]) => `${k}: ${v}`).join(" · ")}
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="ml-auto text-[11px] px-3 py-1.5 border border-white/30 hover:bg-white/10 transition-colors"
        >
          ← Voltar à Busca
        </button>
      </div>

      <div className="bg-[#ececec] border border-gray-400">
        {/* Cabeçalho da tabela */}
        <div
          className="grid px-3 py-2 text-[11px] font-semibold text-white border-b border-gray-400"
          style={{ backgroundColor: "#22252A", gridTemplateColumns: "80px 1fr 100px 120px 70px 70px 80px" }}
        >
          <div className="text-center">Tipo</div>
          <div>Item</div>
          <div>Marca</div>
          <div>Referência</div>
          <div className="text-center">Qtde.</div>
          <div className="text-center">Setor</div>
          <div className="text-right">Valor</div>
        </div>

        {loading && (
          <div className="px-4 py-8 text-center text-xs text-blue-600 animate-pulse">Buscando itens...</div>
        )}
        {erro && (
          <div className="px-4 py-8 text-center text-xs text-red-600">{erro}</div>
        )}
        {!loading && !erro && resultados.length === 0 && (
          <div className="px-4 py-8 text-center text-xs text-gray-500">
            Nenhum item encontrado para os filtros informados.
          </div>
        )}

        {!loading && resultados.map((linha, index) => (
          <div
            key={linha.isKit ? `kit-${linha.kitId}` : (linha.id ?? index)}
            onClick={() => handleClick(linha)}
            className={`grid px-3 py-2 text-[11px] border-b border-gray-200 cursor-pointer transition-colors
              ${linha.isKit
                ? "bg-[#f0f4ff] hover:bg-[#e4eaff]"
                : index % 2 === 0 ? "bg-white hover:bg-orange-50" : "bg-[#f5f5f5] hover:bg-orange-50"
              }`}
            style={{ gridTemplateColumns: "80px 1fr 100px 120px 70px 70px 80px" }}
          >
            {/* Badge de tipo */}
            <div className="text-center">
              {linha.isKit ? (
                <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-sm">
                  {linha.referencia.toUpperCase()}
                </span>
              ) : (
                <span className="text-gray-400 text-[10px]">{linha.codigoItem || "—"}</span>
              )}
            </div>

            <div className="font-medium text-gray-900 truncate">
              {linha.item}
              {linha.isKit && (
                <span className="ml-2 text-[10px] text-blue-500">↗ ver kit</span>
              )}
            </div>

            <div className="text-gray-600 truncate">{linha.marca || "—"}</div>
            <div className="text-gray-500 truncate">{linha.isKit ? "—" : linha.referencia}</div>

            {/* Quantidade com cor por criticidade */}
            <div
              className="text-center font-semibold tabular-nums"
              style={{
                color: linha.quantidade === 0
                  ? "#dc2626"
                  : linha.quantidade <= (linha.quantidadeMinima ?? 1)
                  ? "#ea580c"
                  : "#15803d",
              }}
            >
              {linha.quantidade}
            </div>

            <div className="text-center text-gray-500">{linha.setor}</div>
            <div className="text-right text-gray-600 tabular-nums">{linha.valor ?? "—"}</div>
          </div>
        ))}

        {!loading && resultados.length > 0 && (
          <div className="px-3 py-2 text-[11px] text-gray-500 bg-[#ececec] border-t border-gray-300 flex gap-4">
            <span>{linhasKits.length} kit(s)</span>
            <span>{linhasItens.length} item(ns)</span>
            <span className="ml-auto">{resultados.length} total</span>
          </div>
        )}
      </div>
    </div>
  );
}
