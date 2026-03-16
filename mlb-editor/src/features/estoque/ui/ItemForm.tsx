import { useState } from "react";
import type { EstoqueItem } from "../model/EstoqueItem";
import { useItemForm } from "../lib/useItemForm";
import { TextInput } from "../../../components/forms/inputs/TextInput";
import { NumberInput } from "../../../components/forms/inputs/NumberInput";
import { TabMedidas } from "./tabs/TabMedidas";
import { TabValores } from "./tabs/TabValores";
import { TabHistorico } from "./tabs/TabHistorico";
import { TabImagem } from "./tabs/TabImagem";
import { PanelML } from "./panels/PanelML";
import { PanelSite } from "./panels/PanelSite";

type Tab = "medidas" | "valores" | "historico" | "imagem";
type Panel = "ml" | "site";

type Props = {
    initialItem: EstoqueItem;
};

export function ItemForm({ initialItem }: Props) {
    const { item, handleChange } = useItemForm(initialItem);
    const [activeTab, setActiveTab] = useState<Tab>("medidas");
    const [activePanel, setActivePanel] = useState<Panel>("ml");

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
        <div className="w-full bg-[#ececec] border border-gray-400 p-3 text-xs font-sans">

            {/* Linha 1: Item, Unid, Marca, Tipo Ret., Material, Setor, Local */}
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

            {/* Linha 2: Marca, Modelo, Data Fabricação, Versão/Motor */}
            <div className="grid grid-cols-12 gap-x-2 gap-y-2 mb-2">
                <div className="col-span-3">
                    <TextInput label="Marca:" value={item.marca} onChange={handleChange("marca")} />
                </div>
                <div className="col-span-3">
                    <TextInput label="Modelo:" value={item.marcaModelo} onChange={handleChange("marcaModelo")} />
                </div>
                <div className="col-span-3">
                    <TextInput label="Data de Fabricação:" value={item.dataFabricacao} onChange={handleChange("dataFabricacao")} />
                </div>
                <div className="col-span-3">
                    <TextInput label="Versão / Motor:" value={item.versaoMotor} onChange={handleChange("versaoMotor")} />
                </div>
            </div>

            {/* Linha 3: Fornecedor, Qtde. mínima, MLB */}
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
            </div>

            {/* Seção inferior: Tabs (esquerda) + Panels ML/Site (direita) */}
            <div className="flex gap-3">

                {/* Tabs - lado esquerdo */}
                <div className="flex-1 border border-gray-400 bg-[#ececec]">
                    {/* Cabeçalho das abas */}
                    <div className="flex border-b border-gray-400 bg-[#dcdcdc]">
                        {tabBtn("medidas", "Medidas e Compactibilidade")}
                        {tabBtn("valores", "Valores Comerciais")}
                        {tabBtn("historico", "Histórico e Aplicação")}
                        {tabBtn("imagem", "Imagem")}
                    </div>

                    {/* Conteúdo da aba ativa */}
                    <div className="bg-white min-h-[200px]">
                        {activeTab === "medidas" && (
                            <TabMedidas item={item} handleChange={handleChange} />
                        )}
                        {activeTab === "valores" && (
                            <TabValores item={item} handleChange={handleChange} />
                        )}
                        {activeTab === "historico" && (
                            <TabHistorico item={item} handleChange={handleChange} />
                        )}
                        {activeTab === "imagem" && (
                            <TabImagem item={item} handleChange={handleChange} />
                        )}
                    </div>
                </div>

                {/* Panels ML/Site - lado direito */}
                <div className="w-64 border border-gray-400 bg-[#ececec]">
                    {/* Cabeçalho */}
                    <div className="flex border-b border-gray-400 bg-[#dcdcdc]">
                        {panelBtn("ml", "Mercado Livre")}
                        {panelBtn("site", "Site")}
                    </div>

                    {/* Conteúdo */}
                    <div className="bg-white min-h-[200px]">
                        {activePanel === "ml" && (
                            <PanelML item={item} handleChange={handleChange} />
                        )}
                        {activePanel === "site" && (
                            <PanelSite item={item} handleChange={handleChange} />
                        )}
                    </div>
                </div>

            </div>

            {/* Footer: link imprimir */}
            <div className="mt-3 pt-2 border-t border-gray-300">
                <button className="text-[11px] text-blue-700 underline hover:text-blue-900">
                    &gt;&gt;IMPRIMIR PEDIDO
                </button>
            </div>

        </div>
    );
}
