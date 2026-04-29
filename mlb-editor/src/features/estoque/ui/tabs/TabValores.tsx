import { NumberInput } from "../../../../components/forms/inputs/NumberInput";
import type { EstoqueItem } from "../../model/EstoqueItem";

type Props = {
    item: EstoqueItem;
    handleChange: (key: keyof EstoqueItem) => (value: any) => void;
};

// ── TAXAS FIXAS DOS CANAIS DE VENDA ──────────────────────────────────────────
const TAXAS = {
    mlClassico:   0.138,
    mlPremium10x: 0.205,
    site:         0.113,
};

// "percent" é o default: trata undefined/vazio como percent
function stTipo(item: EstoqueItem): "percent" | "valor" {
    return item.substituicaoTributariaTipo === "valor" ? "valor" : "percent";
}

// ── CÁLCULO DO VALOR COMERCIAL ────────────────────────────────────────────────
// base = Valor Unitário
// com_lucro     = base × (1 + Lucro%)  OU  base + Lucro R$
// com_acrescimo = com_lucro × (1 + Acréscimo%)
// ST            = base × (ST%)  OU  ST R$ fixo   ← sempre sobre o valor unitário bruto
// Valor Comercial (Venda) = com_acrescimo + ST   [read-only]
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
        stTipo(item) === "percent"
            ? base * (stVal / 100)
            : stVal;

    return comAcrescimo + st;
}

// ── CÁLCULO DOS PREÇOS POR CANAL (calculadora) ────────────────────────────────
function calcularCanais(item: EstoqueItem) {
    const base   = parseFloat(String(item.valorUnitario))          || 0;
    const lucro  = parseFloat(String(item.lucroValor))             || 0;
    const frete  = parseFloat(String(item.frete))                  || 0;
    const taxaCO = (parseFloat(String(item.taxaClienteOficina))    || 0) / 100;

    const comLucro =
        item.lucroTipo === "percent"
            ? base * (1 + lucro / 100)
            : base + lucro;

    return {
        precoBase:    comLucro,
        mlClassico:   comLucro * (1 + TAXAS.mlClassico)   + frete,
        mlPremium10x: comLucro * (1 + TAXAS.mlPremium10x) + frete,
        site:         comLucro * (1 + TAXAS.site),
        taxaCliente:  comLucro * (1 + taxaCO),
    };
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
function fmt(value: number): string {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface ResultRowProps {
    label: string;
    value: number;
    colorClass: string;
}

function ResultRow({ label, value, colorClass }: ResultRowProps) {
    return (
        <div className={`flex items-center justify-between px-2 py-1 rounded text-[11px] font-medium ${colorClass}`}>
            <span>{label}</span>
            <span className="font-semibold tabular-nums">{fmt(value)}</span>
        </div>
    );
}

// ── COMPONENTE ───────────────────────────────────────────────────────────────
export function TabValores({ item, handleChange }: Props) {
    const valorComercial = calcularValorComercial(item);
    const canais         = calcularCanais(item);
    const stAtual        = stTipo(item);

    return (
        <div className="p-3 flex flex-col gap-4">

            {/* ── SEÇÃO 1: VALORES COMERCIAIS ── */}
            <div className="grid grid-cols-2 gap-3">

                {/* Valor Unitário — campo único */}
                <div className="col-span-2">
                    <NumberInput
                        label="Valor Unitário:"
                        value={item.valorUnitario}
                        onChange={handleChange("valorUnitario")}
                    />
                </div>

                {/* Lucro */}
                <div className="col-span-2">
                    <span className="text-[11px] font-medium text-gray-700">Lucro:</span>
                    <div className="flex items-center gap-4 mt-1">
                        <label className="flex items-center gap-1 text-[11px]">
                            <input
                                type="radio"
                                name="lucroTipo"
                                value="percent"
                                checked={item.lucroTipo === "percent"}
                                onChange={() => handleChange("lucroTipo")("percent")}
                                className="h-3 w-3"
                            />
                            %
                        </label>
                        <label className="flex items-center gap-1 text-[11px]">
                            <input
                                type="radio"
                                name="lucroTipo"
                                value="fixed"
                                checked={item.lucroTipo === "fixed"}
                                onChange={() => handleChange("lucroTipo")("fixed")}
                                className="h-3 w-3"
                            />
                            R$
                        </label>
                        <NumberInput
                            label=""
                            value={item.lucroValor}
                            onChange={handleChange("lucroValor")}
                            className="w-24"
                        />
                    </div>
                </div>

                {/* Acréscimo — sempre % */}
                <NumberInput
                    label="Acréscimo (%):"
                    value={item.acrescimoPercent}
                    onChange={handleChange("acrescimoPercent")}
                />

                {/* Valor Comercial (Venda) — read-only */}
                <div>
                    <span className="text-[11px] font-medium text-gray-700">Valor Comercial (Venda):</span>
                    <div className="mt-1 px-2 py-1 bg-gray-100 border border-gray-200 rounded text-[11px] font-semibold text-gray-800 tabular-nums select-none">
                        {fmt(valorComercial)}
                    </div>
                </div>

                {/* Substituição Tributária */}
                <div className="col-span-2">
                    <span className="text-[11px] font-medium text-gray-700">Substituição Tributária:</span>
                    <div className="flex items-center gap-4 mt-1">
                        <label className="flex items-center gap-1 text-[11px]">
                            <input
                                type="radio"
                                name="stTipo"
                                value="percent"
                                checked={stAtual === "percent"}
                                onChange={() => handleChange("substituicaoTributariaTipo")("percent")}
                                className="h-3 w-3"
                            />
                            %
                        </label>
                        <label className="flex items-center gap-1 text-[11px]">
                            <input
                                type="radio"
                                name="stTipo"
                                value="valor"
                                checked={stAtual === "valor"}
                                onChange={() => handleChange("substituicaoTributariaTipo")("valor")}
                                className="h-3 w-3"
                            />
                            R$
                        </label>
                        <NumberInput
                            label=""
                            value={item.substituicaoTributariaValor}
                            onChange={handleChange("substituicaoTributariaValor")}
                            className="w-24"
                        />
                    </div>
                </div>

            </div>

            {/* ── DIVISOR ── */}
            <hr className="border-gray-200" />

            {/* ── SEÇÃO 2: CALCULADORA DE PREÇOS ── */}
            <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Calculadora de Preços
                </p>

                <div className="grid grid-cols-2 gap-3 mb-3">
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

                <ResultRow
                    label="Preço Base (com lucro)"
                    value={canais.precoBase}
                    colorClass="bg-gray-100 text-gray-800"
                />

                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-1">
                    Preços por Canal
                </p>
                <div className="flex flex-col gap-1">
                    <ResultRow
                        label="ML Clássico (13,8%)"
                        value={canais.mlClassico}
                        colorClass="bg-pink-100 text-pink-800"
                    />
                    <ResultRow
                        label="ML Premium 10x (20,5%)"
                        value={canais.mlPremium10x}
                        colorClass="bg-blue-100 text-blue-800"
                    />
                    <ResultRow
                        label="Site (11,3%)"
                        value={canais.site}
                        colorClass="bg-gray-200 text-gray-700"
                    />
                    <ResultRow
                        label="Taxa Cliente / Oficina"
                        value={canais.taxaCliente}
                        colorClass="bg-red-100 text-red-800"
                    />
                </div>
            </div>

        </div>
    );
}
