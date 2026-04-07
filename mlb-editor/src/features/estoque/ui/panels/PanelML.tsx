import { TextInput } from "../../../../components/forms/inputs/TextInput";
import { DateInput } from "../../../../components/forms/inputs/DateInput";
import { CheckboxInput } from "../../../../components/forms/inputs/CheckboxInput";
import { SelectInput } from "../../../../components/forms/inputs/SelectInput";
import type { EstoqueItem } from "../../model/EstoqueItem";

type Props = {
    item: EstoqueItem;
    handleChange: (key: keyof EstoqueItem) => (value: any) => void;
};

const SITUACAO_ML_OPTIONS = [
    "Anunciado Mercado Livre Premium",
    "Anunciado Mercado Livre Classico",
    "Anunciado no Site",
    "Anunciado no Google",
    "Pausado",
    "Arrumar anuncio",
    "Reativado",
    "Anunciar Mercado Livre",
    "Ver Posicionamento Pagina",
    "Pausado Campanha",
    "Campanha Rentabilidade",
    "Patrocinar",
    "Mudar Quantidade Mercado Livre",
    "Duplicar Anuncio",
    "Pausado Mercado Livre",
    "Acompanhar Posicionamento",
    "Reativar Mercado Livre",
    "Excluido",
    "Arrumar Foto"

].map(opt => ({ value: opt, label: opt }));

export function PanelML({ item, handleChange }: Props) {
    const setQuantidade = (next: number) => {
        handleChange("quantidade")(Math.max(0, next));
    };

    return (
        <div className="p-3 flex flex-col gap-2">
            <SelectInput
                label="Situação:"
                value={item.situacaoML}
                onChange={handleChange("situacaoML")}
                options={SITUACAO_ML_OPTIONS}
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
            </div>

            <div className="mt-1">
                <div className="text-[11px] text-gray-700 mb-1">Repor / Somar:</div>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setQuantidade(item.quantidade - 1)}
                        className="w-7 h-7 border border-gray-400 bg-gray-100 rounded text-gray-700 font-bold hover:bg-gray-200"
                    >
                        -
                    </button>
                    <input
                        type="text"
                        value={item.quantidade}
                        onChange={(e) => setQuantidade(Number(e.target.value) || 0)}
                        className="flex-1 h-7 border border-gray-300 bg-gray-50 text-center font-bold text-green-700"
                    />
                    <button
                        type="button"
                        onClick={() => setQuantidade(item.quantidade + 1)}
                        className="w-7 h-7 border border-gray-400 bg-gray-100 rounded text-gray-700 font-bold hover:bg-gray-200"
                    >
                        +
                    </button>
                </div>
            </div>

            <div className="mt-1 pt-2 border-t border-gray-200">
                <TextInput
                    label="Revisado:"
                    value={item.revisado}
                    onChange={handleChange("revisado")}
                />
            </div>
        </div>
    );
}