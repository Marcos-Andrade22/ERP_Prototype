import { NumberInput } from "../../../../components/forms/inputs/NumberInput";
import type { EstoqueItem } from "../../model/EstoqueItem";
import { calcularValorComercial } from "../../lib/estoque-calc";

type Props = {
    item: EstoqueItem;
    handleChange: (key: keyof EstoqueItem) => (value: any) => void;
};

const TAXAS = {
    mlClassico:   0.138,
    mlPremium10x: 0.205,
    site:         0.113,
};

function stTipo(item: EstoqueItem): "percent" | "valor" {
    return item.substituicaoTributariaTipo === "valor" ? "valor" : "percent";
}

function calcularCanais(item: EstoqueItem) {
    const precoBase = calcularValorComercial(item);
    const frete     = parseFloat(String(item.frete))               || 0;
    const taxaCO    = (parseFloat(String(item.taxaClienteOficina)) || 0) / 100;
    return {
        precoBase,
        mlClassico:   precoBase * (1 + TAXAS.mlClassico)   + frete,
        mlPremium10x: precoBase * (1 + TAXAS.mlPremium10x) + frete,
        site:         precoBase * (1 + TAXAS.site),
        taxaCliente:  precoBase * (1 + taxaCO),
    };
}

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface CanalRowProps {
    label: string;
    sub: string;
    value: number;
    bg: string;
    text: string;
}

function CanalRow({ label, sub, value, bg, text }: CanalRowProps) {
    return (
        <div className={`flex items-center justify-between px-3 py-2 rounded ${bg} mb-1`}>
            <div>
                <p className={`text-[11px] font-semibold ${text}`}>{label}</p>
                <p className="text-[10px] text-gray-400">{sub}</p>
            </div>
            <span className={`text-[13px] font-bold tabular-nums ${text}`}>{fmt(value)}</span>
        </div>
    );
}

export function TabValores({ item, handleChange }: Props) {
    const valorComercial = calcularValorComercial(item);
    const canais         = calcularCanais(item);
    const stAtual        = stTipo(item);

    return (
        // ── GRID DUAS COLUNAS: esquerda = inputs | direita = resultados ──
        <div className="grid grid-cols-2 divide-x divide-gray-200 min-h-[320px]">

            {/* ── COLUNA ESQUERDA: entradas ── */}
            <div className="p-4 flex flex-col gap-3">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Entradas</p>

                {/* Valor Unitário */}
                <NumberInput
                    label="Valor Unitário:"
                    value={item.valorUnitario}
                    onChange={handleChange("valorUnitario")}
                />

                {/* Lucro */}
                <div>
                    <span className="text-[11px] font-medium text-gray-600">Lucro:</span>
                    <div className="flex items-center gap-3 mt-1">
                        <label className="flex items-center gap-1 text-[11px] text-gray-700">
                            <input type="radio" name="lucroTipo" value="percent"
                                checked={item.lucroTipo === "percent"}
                                onChange={() => handleChange("lucroTipo")("percent")}
                                className="h-3 w-3" />
                            %
                        </label>
                        <label className="flex items-center gap-1 text-[11px] text-gray-700">
                            <input type="radio" name="lucroTipo" value="fixed"
                                checked={item.lucroTipo === "fixed"}
                                onChange={() => handleChange("lucroTipo")("fixed")}
                                className="h-3 w-3" />
                            R$
                        </label>
                        <div className="w-24">
                            <NumberInput label="" value={item.lucroValor} onChange={handleChange("lucroValor")} />
                        </div>
                    </div>
                </div>

                {/* Acréscimo */}
                <NumberInput
                    label="Acréscimo (%):"
                    value={item.acrescimoPercent}
                    onChange={handleChange("acrescimoPercent")}
                />

                {/* ST */}
                <div>
                    <span className="text-[11px] font-medium text-gray-600">Substituição Tributária:</span>
                    <div className="flex items-center gap-3 mt-1">
                        <label className="flex items-center gap-1 text-[11px] text-gray-700">
                            <input type="radio" name="stTipo" value="percent"
                                checked={stAtual === "percent"}
                                onChange={() => handleChange("substituicaoTributariaTipo")("percent")}
                                className="h-3 w-3" />
                            %
                        </label>
                        <label className="flex items-center gap-1 text-[11px] text-gray-700">
                            <input type="radio" name="stTipo" value="valor"
                                checked={stAtual === "valor"}
                                onChange={() => handleChange("substituicaoTributariaTipo")("valor")}
                                className="h-3 w-3" />
                            R$
                        </label>
                        <div className="w-24">
                            <NumberInput label="" value={item.substituicaoTributariaValor} onChange={handleChange("substituicaoTributariaValor")} />
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Frete + Taxa */}
                <NumberInput
                    label="Frete (R$):"
                    value={item.frete}
                    onChange={handleChange("frete")}
                />
                <NumberInput
                    label="Taxa Cliente / Oficina (%):"
                    value={item.taxaClienteOficina}
                    onChange={handleChange("taxaClienteOficina")}
                />
            </div>

            {/* ── COLUNA DIREITA: resultados ── */}
            <div className="p-4 flex flex-col gap-2">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Resultados em tempo real</p>

                {/* Valor Comercial destaque */}
                <div className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded mb-2">
                    <span className="text-[11px] font-semibold text-gray-600">Valor Comercial (base)</span>
                    <span className="text-[14px] font-bold text-gray-800 tabular-nums">{fmt(canais.precoBase)}</span>
                </div>

                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Preços por Canal</p>

                <CanalRow
                    label="ML Clássico"
                    sub="taxa 13,8% + frete"
                    value={canais.mlClassico}
                    bg="bg-pink-50"
                    text="text-pink-800"
                />
                <CanalRow
                    label="ML Premium 10x"
                    sub="taxa 20,5% + frete"
                    value={canais.mlPremium10x}
                    bg="bg-blue-50"
                    text="text-blue-800"
                />
                <CanalRow
                    label="Site"
                    sub="taxa 11,3% · sem frete"
                    value={canais.site}
                    bg="bg-gray-100"
                    text="text-gray-700"
                />
                <CanalRow
                    label="Taxa Cliente / Oficina"
                    sub="taxa personalizada"
                    value={canais.taxaCliente}
                    bg="bg-red-50"
                    text="text-red-800"
                />

                <p className="text-[10px] text-gray-300 italic mt-auto pt-2">
                    Atualiza a cada alteração nos campos ao lado.
                </p>
            </div>

        </div>
    );
}
