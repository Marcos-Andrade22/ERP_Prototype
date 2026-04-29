import { TextInput } from "../../../../components/forms/inputs/TextInput";
import { NumberInput } from "../../../../components/forms/inputs/NumberInput";
import type { EstoqueItem } from "../../model/EstoqueItem";

type Props = {
    item: EstoqueItem;
    handleChange: (key: keyof EstoqueItem) => (value: any) => void;
};

// Taxas fixas conforme calculadora
const TAXAS = {
    mlClassico:   0.138,
    mlPremium10x: 0.205,
    site:         0.113,
};

function calcular(item: EstoqueItem) {
    const precoCusto         = parseFloat(String(item.valorUnitarioFixo))   || 0;
    const percentualVenda    = (parseFloat(String(item.lucroValor))          || 0) / 100;
    const frete              = parseFloat(String(item.frete))               || 0;
    const taxaClienteOficina = (parseFloat(String(item.taxaClienteOficina)) || 0) / 100;

    const precoBase = precoCusto * (1 + percentualVenda);

    return {
        precoBase,
        mlClassico:   precoBase * (1 + TAXAS.mlClassico)   + frete,
        mlPremium10x: precoBase * (1 + TAXAS.mlPremium10x) + frete,
        site:         precoBase * (1 + TAXAS.site),
        taxaCliente:  precoBase * (1 + taxaClienteOficina),
    };
}

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

export function TabValores({ item, handleChange }: Props) {
    const resultados = calcular(item);

    return (
        <div className="p-3 flex flex-col gap-4">

            {/* ── SEÇÃO 1: VALORES COMERCIAIS (interface original) ── */}
            <div className="grid grid-cols-2 gap-3">
                <TextInput
                    label="Valor Unitário Fixo:"
                    value={item.valorUnitarioFixo}
                    onChange={handleChange("valorUnitarioFixo")}
                />
                <TextInput
                    label="Valor Unitário:"
                    value={item.valorUnitario}
                    onChange={handleChange("valorUnitario")}
                />

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
                            Valor
                        </label>
                        <NumberInput
                            label=""
                            value={item.lucroValor}
                            onChange={handleChange("lucroValor")}
                            className="w-24"
                        />
                    </div>
                </div>

                <NumberInput
                    label="Acréscimo %:"
                    value={item.acrescimoPercent}
                    onChange={handleChange("acrescimoPercent")}
                />
                <TextInput
                    label="Valor Comercial Venda:"
                    value={item.valorComercialVenda}
                    onChange={handleChange("valorComercialVenda")}
                />

                {/* Substituição Tributária */}
                <div className="col-span-2">
                    <span className="text-[11px] font-medium text-gray-700">Substituição Tributária:</span>
                    <div className="flex items-center gap-4 mt-1">
                        <label className="flex items-center gap-1 text-[11px]">
                            <input
                                type="radio"
                                name="stTipo"
                                value="percent"
                                checked={item.substituicaoTributariaTipo === "percent"}
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
                                checked={item.substituicaoTributariaTipo === "valor"}
                                onChange={() => handleChange("substituicaoTributariaTipo")("valor")}
                                className="h-3 w-3"
                            />
                            Valor
                        </label>
                        <TextInput
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

                {/* Inputs extras da calculadora */}
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

                {/* Preço Base */}
                <ResultRow
                    label="Preço Base"
                    value={resultados.precoBase}
                    colorClass="bg-gray-100 text-gray-800"
                />

                {/* Preços por canal */}
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-1">
                    Preços por Canal
                </p>
                <div className="flex flex-col gap-1">
                    <ResultRow
                        label="ML Clássico (13,8%)"
                        value={resultados.mlClassico}
                        colorClass="bg-pink-100 text-pink-800"
                    />
                    <ResultRow
                        label="ML Premium 10x (20,5%)"
                        value={resultados.mlPremium10x}
                        colorClass="bg-blue-100 text-blue-800"
                    />
                    <ResultRow
                        label="Site (11,3%)"
                        value={resultados.site}
                        colorClass="bg-gray-200 text-gray-700"
                    />
                    <ResultRow
                        label="Taxa Cliente / Oficina"
                        value={resultados.taxaCliente}
                        colorClass="bg-red-100 text-red-800"
                    />
                </div>
            </div>

        </div>
    );
}
