import { TextInput } from "../../../../components/forms/inputs/TextInput";
import { DateInput } from "../../../../components/forms/inputs/DateInput";
import type { EstoqueItem } from "../../model/EstoqueItem";
import { SelectInput } from "../../../../components/forms/inputs/SelectInput";

type Props = {
    item: EstoqueItem;
    handleChange: (key: keyof EstoqueItem) => (value: any) => void;
};

const SITUACAO_SITE_OPTIONS = [
    "Anunciado no Site",
    "Anunciado no Google",
    "Pausado",
    "Arrumar anuncio",
    "Reativado",
    "Ver Posicionamento Pagina",
    "Pausado Campanha",
    "Campanha Rentabilidade",
    "Patrocinar",
    "Duplicar Anuncio",
    "Acompanhar Posicionamento",
    "Excluido",
    "Arrumar Foto"

].map(opt => ({ value: opt, label: opt }));

export function PanelSite({ item, handleChange }: Props) {
    return (
        <div className="p-3 flex flex-col gap-2">
            <SelectInput
                label="Situação:"
                value={item.situacaoML}
                onChange={handleChange("situacaoML")}
                options={SITUACAO_SITE_OPTIONS}
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
