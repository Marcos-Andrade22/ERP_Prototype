import { TextInput } from "../../../../components/forms/inputs/TextInput";
import { DateInput } from "../../../../components/forms/inputs/DateInput";
import { CheckboxInput } from "../../../../components/forms/inputs/CheckboxInput";
import type { EstoqueItem } from "../../model/EstoqueItem";

type Props = {
    item: EstoqueItem;
    handleChange: (key: keyof EstoqueItem) => (value: any) => void;
};

export function PanelML({ item, handleChange }: Props) {
    return (
        <div className="p-3 flex flex-col gap-2">
            <TextInput
                label="Situação:"
                value={item.situacaoML}
                onChange={handleChange("situacaoML")}
            />
            <div className="grid grid-cols-2 gap-2">
                <DateInput
                    label="Data do Anúncio:"
                    value={item.dataAnuncioML}
                    onChange={handleChange("dataAnuncioML")}
                />
                <TextInput
                    label="Valor:"
                    value={item.valorML}
                    onChange={handleChange("valorML")}
                />
            </div>

            <div className="flex flex-wrap gap-3 mt-1">
                <CheckboxInput
                    label="Pedir"
                    checked={item.pedir}
                    onChange={handleChange("pedir")}
                />
                <CheckboxInput
                    label="Promoção"
                    checked={item.promocao}
                    onChange={handleChange("promocao")}
                />
            </div>

            <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-gray-700">Alocar para Site:</span>
                <CheckboxInput
                    label=""
                    checked={item.alocarParaSite}
                    onChange={handleChange("alocarParaSite")}
                />
            </div>

            <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-700">Repor / Somar:</span>
                <CheckboxInput
                    label=""
                    checked={item.reponerSomar}
                    onChange={handleChange("reponerSomar")}
                />
            </div>

            <div className="flex items-center gap-3 mt-1 pt-2 border-t border-gray-200">
                <CheckboxInput
                    label="Revisado"
                    checked={item.revisado}
                    onChange={handleChange("revisado")}
                />
            </div>
        </div>
    );
}
