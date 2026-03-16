import { TextInput } from "../../../../components/forms/inputs/TextInput";
import { DateInput } from "../../../../components/forms/inputs/DateInput";
import type { EstoqueItem } from "../../model/EstoqueItem";

type Props = {
    item: EstoqueItem;
    handleChange: (key: keyof EstoqueItem) => (value: any) => void;
};

export function PanelSite({ item, handleChange }: Props) {
    return (
        <div className="p-3 flex flex-col gap-2">
            <TextInput
                label="Situação:"
                value={item.situacaoSite}
                onChange={handleChange("situacaoSite")}
            />
            <div className="grid grid-cols-2 gap-2">
                <DateInput
                    label="Data do Anúncio:"
                    value={item.dataAnuncioSite}
                    onChange={handleChange("dataAnuncioSite")}
                />
                <TextInput
                    label="Valor:"
                    value={item.valorSite}
                    onChange={handleChange("valorSite")}
                />
            </div>
        </div>
    );
}
