import { NumberInput } from "../../../../components/forms/inputs/NumberInput";
import type { EstoqueItem } from "../../model/EstoqueItem";

type Props = {
    item: EstoqueItem;
    handleChange: (key: keyof EstoqueItem) => (value: any) => void;
};

// Taxas fixas conforme calculadora
const TAXAS = {
    shopsClassico:   0.022,
    shopsPremium3x:  0.088,
    shopsPremium12x: 0.138,
    mlClassico:      0.138,
    mlPremium10x:    0.205,
    site:            0.113,
};

function calcular(item: EstoqueItem) {
    const precoCusto         = parseFloat(String(item.valorUnitarioFixo))   || 0;
    const percentualVenda    = (parseFloat(String(item.lucroValor))          || 0) / 100;
    const frete              = parseFloat(String(item.frete))               || 0;
    const taxaClienteOficina = (parseFloat(String(item.taxaClienteOficina)) || 0) / 100;

    const precoBase = precoCusto * (1 + percentualVenda);

    return {
        precoBase,
        shopsClassico:   precoBase * (1 + TAXAS.shopsClassico)   + frete,
        shopsPremium3x:  precoBase * (1 + TAXAS.shopsPremium3x)  + frete,
        shopsPremium12x: precoBase * (1 + TAXAS.shopsPremium12x) + frete,
        mlClassico:      precoBase * (1 + TAXAS.mlClassico)      + frete,
        mlPremium10x:    precoBase * (1 + TAXAS.mlPremium10x)    + frete,
        site:            precoBase * (1 + TAXAS.site),
        taxaCliente:     precoBase * (1 + taxaClienteOficina),
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

            {/* ENTRADAS */}
            <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Entradas
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <NumberInput
                        label="Preço Custo (R$):"
                        value={item.valorUnitarioFixo}
                        onChange={handleChange("valorUnitarioFixo")}
                    />
                    <NumberInput
                        label="Percentual de Venda (%):"
                        value={item.lucroValor}
                        onChange={handleChange("lucroValor")}
                    />
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
            </div>

            {/* PREÇO BASE */}
            <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Preço Base
                </p>
                <ResultRow
                    label="Preço Base"
                    value={resultados.precoBase}
                    colorClass="bg-gray-100 text-gray-800"
                />
            </div>

            {/* RESULTADOS CALCULADOS */}
            <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Preços por Canal
                </p>
                <div className="flex flex-col gap-1">
                    <ResultRow
                        label="Shops Clássico (2,2%)"
                        value={resultados.shopsClassico}
                        colorClass="bg-yellow-100 text-yellow-800"
                    />
                    <ResultRow
                        label="Shops Premium 3x (8,8%)"
                        value={resultados.shopsPremium3x}
                        colorClass="bg-green-100 text-green-800"
                    />
                    <ResultRow
                        label="Shops Premium 12x (13,8%)"
                        value={resultados.shopsPremium12x}
                        colorClass="bg-orange-100 text-orange-800"
                    />
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
