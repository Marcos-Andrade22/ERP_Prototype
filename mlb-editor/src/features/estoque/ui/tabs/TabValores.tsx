import { TextInput } from "../../../../components/forms/inputs/TextInput";
import { NumberInput } from "../../../../components/forms/inputs/NumberInput";
import type { EstoqueItem } from "../../model/EstoqueItem";

type Props = {
    item: EstoqueItem;
    handleChange: (key: keyof EstoqueItem) => (value: any) => void;
};

export function TabValores({ item, handleChange }: Props) {
    return (
        <div className="p-3 grid grid-cols-2 gap-3">
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
                            value="valor"
                            checked={item.lucroTipo === "valor"}
                            onChange={() => handleChange("lucroTipo")("valor")}
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
                <span className="text-[11px] font-medium text-gray-700">
                    Substituição Tributária:
                </span>
                <div className="flex items-center gap-4 mt-1">
                    <label className="flex items-center gap-1 text-[11px]">
                        <input
                            type="radio"
                            name="stTipo"
                            value="percent"
                            checked={item.substituicaoTributariaTipo === "percent"}
                            onChange={() =>
                                handleChange("substituicaoTributariaTipo")("percent")
                            }
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
                            onChange={() =>
                                handleChange("substituicaoTributariaTipo")("valor")
                            }
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
    );
}
