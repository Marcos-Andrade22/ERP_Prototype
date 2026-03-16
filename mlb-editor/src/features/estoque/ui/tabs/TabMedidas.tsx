import { TextInput } from "../../../../components/forms/inputs/TextInput";
import { TextareaInput } from "../../../../components/forms/inputs/TextareaInput";
import type { EstoqueItem } from "../../model/EstoqueItem";

type Props = {
    item: EstoqueItem;
    handleChange: (key: keyof EstoqueItem) => (value: any) => void;
};

export function TabMedidas({ item, handleChange }: Props) {
    return (
        <div className="flex gap-4 p-3">
            {/* Coluna esquerda: medidas */}
            <div className="flex flex-col gap-2 w-40 shrink-0">
                <TextInput
                    label="Medida Interna:"
                    value={item.medidaInterna}
                    onChange={handleChange("medidaInterna")}
                />
                <TextInput
                    label="Medida Externa:"
                    value={item.medidaExterna}
                    onChange={handleChange("medidaExterna")}
                />
                <TextInput
                    label="Altura:"
                    value={item.altura}
                    onChange={handleChange("altura")}
                />
                <TextInput
                    label="Peso Total:"
                    value={item.pesoTotal}
                    onChange={handleChange("pesoTotal")}
                />
            </div>

            {/* Coluna direita: histórico */}
            <div className="flex-1">
                <TextareaInput
                    label="Histórico:"
                    value={item.historico}
                    onChange={handleChange("historico")}
                    rows={7}
                />
            </div>
        </div>
    );
}
