import { useState } from "react";
import type { EstoqueItem } from "../model/EstoqueItem";
import { useItemForm } from "../lib/useItemForm";
import type { SaveStatus } from "../lib/useItemForm";
import { TextInput } from "../../../components/forms/inputs/TextInput";
import { NumberInput } from "../../../components/forms/inputs/NumberInput";
import { TabMedidas } from "./tabs/TabMedidas";
import { TabValores } from "./tabs/TabValores";
import { TabHistorico } from "./tabs/TabHistorico";
import { TabImagem } from "./tabs/TabImagem";
import { PanelML } from "./panels/PanelML";
import { PanelSite } from "./panels/PanelSite";
import MlbTable from "../../../components/MlbTable";

type Tab = "medidas" | "valores" | "historico" | "imagem";
type Panel = "ml" | "site";

type Props = {
    initialItem: EstoqueItem;
    onDelete?: () => void; // ← novo    
};

const saveStatusLabel: Record<SaveStatus, React.ReactNode> = {
    idle: null,
    saving: <span className="text-blue-500 animate-pulse">Salvando...</span>,
    saved: <span className="text-green-600 font-semibold">Salvo ✓</span>,
    error: <span className="text-red-600 font-semibold">Erro ao salvar ✗</span>,
};

export function ItemForm({ initialItem, onDelete }: Props) {
    const { item, handleChange, save, saveStatus } = useItemForm(initialItem);
    const [activeTab, setActiveTab] = useState<Tab>("medidas");
    const [activePanel, setActivePanel] = useState<Panel>("ml");

    const handleContainerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            save();
        }
    };

    const tabBtn = (tab: Tab, label: string) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-[11px] border-r border-gray-300 transition-colors ${activeTab === tab
                ? "bg-white font-semibold text-gray-900"
                : "bg-[#dcdcdc] text-gray-600 hover:bg-gray-200"
                }`}
        >
            {label}
        </button>
    );

    const panelBtn = (panel: Panel, label: string) => (
        <button
            onClick={() => setActivePanel(panel)}
            className={`px-3 py-1 text-[11px] border-r border-gray-300 transition-colors ${activePanel === panel
                ? "bg-white font-semibold text-gray-900"
                : "bg-[#dcdcdc] text-gray-600 hover:bg-gray-200"
                }`}
        >
            {label}
        </button>
    );

    return (
        <div
            className="w-full bg-[#ececec] border border-gray-400 p-3 text-xs font-sans"
            onBlur={handleContainerBlur}
        >
            {/* Cabeçalho */}
            <div className="flex items-end justify-between mb-3">
                <div className="flex items-end gap-2">
                    <MlbTable itemId={item.id!} />
                    <div className="w-32">
                        <TextInput label="Código:" value={item.codigo_item} onChange={handleChange("codigo_item")} />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-[11px]">{saveStatusLabel[saveStatus]}</span>
                    <span className="text-[11px] font-semibold text-red-600">
                        Disponíveis: {item.quantidade}
                    </span>
                    {item.id && onDelete && (
                        <button
                            onClick={onDelete}
                            className="px-2 py-1 text-[11px] border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Excluir
                        </button>
                    )}
                </div>
            </div>

            {/* Linha 1 */}
            <div className="grid grid-cols-12 gap-x-2 gap-y-2 mb-2">
                <div className="col-span-5">
                    <TextInput label="Item:" value={item.item} onChange={handleChange("item")} />
                </div>
                <div className="col-span-1">
                    <TextInput label="Unid.:" value={item.unid} onChange={handleChange("unid")} />
                </div>
                <div className="col-span-2">
                    <TextInput label="Marca:" value={item.marca} onChange={handleChange("marca")} />
                </div>
                <div className="col-span-1">
                    <TextInput label="Tipo Ret.:" value={item.tipoRetentor} onChange={handleChange("tipoRetentor")} />
                </div>
                <div className="col-span-1">
                    <TextInput label="Material:" value={item.material} onChange={handleChange("material")} />
                </div>
                <div className="col-span-1">
                    <TextInput label="Setor:" value={item.setor} onChange={handleChange("setor")} />
                </div>
                <div className="col-span-1">
                    <TextInput label="Local:" value={item.local} onChange={handleChange("local")} />
                </div>
            </div>

            {/* Linha 2 */}
            <div className="grid grid-cols-12 gap-x-2 gap-y-2 mb-2">
                <div className="col-span-3">
                    <TextInput label="Montadora:" value={item.montadora} onChange={handleChange("montadora")} />
                </div>
                <div className="col-span-3">
                    <TextInput label="Aplicações:" value={item.aplicacoes} onChange={handleChange("aplicacoes")} />
                </div>
                <div className="col-span-3">
                    <TextInput label="Data de Fabricação:" value={item.dataFabricacao} onChange={handleChange("dataFabricacao")} />
                </div>
                <div className="col-span-3">
                    <TextInput label="Versão / Motor:" value={item.versaoMotor} onChange={handleChange("versaoMotor")} />
                </div>
            </div>

            {/* Linha 3 */}
            <div className="grid grid-cols-12 gap-x-2 gap-y-2 mb-3">
                <div className="col-span-5">
                    <TextInput label="Fornecedor:" value={item.fornecedor} onChange={handleChange("fornecedor")} />
                </div>
                <div className="col-span-2">
                    <NumberInput label="Qtde. mínima:" value={item.quantidadeMinima} onChange={handleChange("quantidadeMinima")} />
                </div>
                <div className="col-span-2">
                    <TextInput label="MLB:" value={item.mlb} onChange={handleChange("mlb")} />
                </div>
                <div className="col-span-2">
                    <TextInput label="Posição:" value={item.posicao} onChange={handleChange("posicao")} />
                </div>
            </div>

            {/* Seção inferior */}
            <div className="flex gap-3">
                <div className="flex-1 border border-gray-400 bg-[#ececec]">
                    <div className="flex border-b border-gray-400 bg-[#dcdcdc]">
                        {tabBtn("medidas", "Medidas e Compactibilidade")}
                        {tabBtn("valores", "Valores Comerciais")}
                        {tabBtn("historico", "Histórico e Aplicação")}
                        {tabBtn("imagem", "Imagem")}
                    </div>
                    <div className="bg-white min-h-[200px]">
                        {activeTab === "medidas" && <TabMedidas item={item} handleChange={handleChange} />}
                        {activeTab === "valores" && <TabValores item={item} handleChange={handleChange} />}
                        {activeTab === "historico" && <TabHistorico item={item} handleChange={handleChange} />}
                        {activeTab === "imagem" && <TabImagem item={item} handleChange={handleChange} />}
                    </div>
                </div>

                <div className="w-64 border border-gray-400 bg-[#ececec]">
                    <div className="flex border-b border-gray-400 bg-[#dcdcdc]">
                        {panelBtn("ml", "Mercado Livre")}
                        {panelBtn("site", "Site")}
                    </div>
                    <div className="bg-white min-h-[200px]">
                        {activePanel === "ml" && <PanelML item={item} handleChange={handleChange} />}
                        {activePanel === "site" && <PanelSite item={item} handleChange={handleChange} />}
                    </div>
                </div>
            </div>
        </div>
    );
}