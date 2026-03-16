import { TextareaInput } from "../../../../components/forms/inputs/TextareaInput";
import type { EstoqueItem } from "../../model/EstoqueItem";

type Props = {
    item: EstoqueItem;
    handleChange: (key: keyof EstoqueItem) => (value: any) => void;
};

export function TabHistorico({ item, handleChange }: Props) {
    return (
        <div className="p-3 flex flex-col gap-3">
            <TextareaInput
                label="Observações Gerais:"
                value={item.observacoesGerais}
                onChange={handleChange("observacoesGerais")}
                rows={3}
            />
            <TextareaInput
                label="Itens Similares / Compactibilidade:"
                value={item.itensSimilaresCompactibilidade}
                onChange={handleChange("itensSimilaresCompactibilidade")}
                rows={3}
            />
            <TextareaInput
                label="Aplicações Possíveis:"
                value={item.aplicacoesPossiveis}
                onChange={handleChange("aplicacoesPossiveis")}
                rows={3}
            />
        </div>
    );
}
