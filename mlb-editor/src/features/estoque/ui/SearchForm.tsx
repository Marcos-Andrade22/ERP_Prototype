import { useState } from "react";
import type { EstoqueItem } from "../model/EstoqueItem";
import { TextInput } from "../../../components/forms/inputs/TextInput";
import { TabMedidas } from "./tabs/TabMedidas";
import { TabValores } from "./tabs/TabValores";
import { TabHistorico } from "./tabs/TabHistorico";
import { PanelML } from "./panels/PanelML";
import { PanelSite } from "./panels/PanelSite";

type Tab = "medidas" | "valores" | "historico";
type Panel = "ml" | "site";

type Props = {
    onSearch: (filtros: Partial<EstoqueItem>) => void;
};

const emptyFilters: Partial<EstoqueItem> = {
    codigo_item: "", item: "", unid: "", marca: "", tipoRetentor: "", material: "",
    sentido: "", setor: "", local: "", montadora: "", aplicacoes: "",
    dataFabricacao: "", versaoMotor: "", aplicacoesPossiveis: "",
    fornecedor: "", garantia: "", mlb: "", posicao: "", conversao: "", referencia: "",
    medidaInterna: "", medidaExterna: "", altura: "", pesoTotal: "",
    valorUnitarioFixo: "", valorUnitario: "", valorComercialVenda: "",
    substituicaoTributariaValor: "", lucroTipo: "percent", lucroValor: 0, acrescimoPercent: 0,
    observacoesGerais: "", itensSimilaresCompactibilidade: "",
    situacaoML: "", dataAnuncioML: "", valorML: "",
    situacaoSite: "", dataAnuncioSite: "", valorSite: "",
    revisado: "", alocarParaSite: "", reporeSomar: "",
};

export function SearchForm({ onSearch }: Props) {
    const [filtros, setFiltros] = useState<Partial<EstoqueItem>>(emptyFilters);
    const [activeTab, setActiveTab] = useState<Tab>("medidas");
    const [activePanel, setActivePanel] = useState<Panel>("ml");

    const handleChange = (key: keyof EstoqueItem) => (value: any) => {
        setFiltros(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        const filtrosAtivos = Object.fromEntries(
            Object.entries(filtros).filter(([_, v]) => v !== "" && v !== 0 && v !== null)
        );
        onSearch(filtrosAtivos);
    };

    const handleLimpar = () => setFiltros(emptyFilters);

    const tabBtn = (tab: Tab, label: string) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-[11px] border-r border-blue-200 transition-colors ${activeTab === tab
                ? "bg-white font-semibold text-gray-900"
                : "bg-[#dce8f5] text-gray-600 hover:bg-blue-100"
                }`}
        >
            {label}
        </button>
    );

    const panelBtn = (panel: Panel, label: string) => (
        <button
            onClick={() => setActivePanel(panel)}
            className={`px-3 py-1 text-[11px] border-r border-blue-200 transition-colors ${activePanel === panel
                ? "bg-white font-semibold text-gray-900"
                : "bg-[#dce8f5] text-gray-600 hover:bg-blue-100"
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="w-full bg-[#e8f0fe] border-2 border-blue-400 p-3 text-xs font-sans">
            {/* Cabeçalho */}
            <div className="flex items-end justify-between mb-3">
                <div className="w-32">
                    <TextInput label="Código:" value={filtros.codigo_item ?? ""} onChange={handleChange("codigo_item")} />
                </div>
            </div>

            {/* Linha 1 */}
            <div className="grid grid-cols-12 gap-x-2 gap-y-2 mb-2">
                <div className="col-span-5">
                    <TextInput label="Item:" value={filtros.item ?? ""} onChange={handleChange("item")} />
                </div>
                <div className="col-span-1">
                    <TextInput label="Unid.:" value={filtros.unid ?? ""} onChange={handleChange("unid")} />
                </div>
                <div className="col-span-2">
                    <TextInput label="Marca:" value={filtros.marca ?? ""} onChange={handleChange("marca")} />
                </div>
                <div className="col-span-1">
                    <TextInput label="Tipo Ret.:" value={filtros.tipoRetentor ?? ""} onChange={handleChange("tipoRetentor")} />
                </div>
                <div className="col-span-1">
                    <TextInput label="Material:" value={filtros.material ?? ""} onChange={handleChange("material")} />
                </div>
                <div className="col-span-1">
                    <TextInput label="Setor:" value={filtros.setor ?? ""} onChange={handleChange("setor")} />
                </div>
                <div className="col-span-1">
                    <TextInput label="Local:" value={filtros.local ?? ""} onChange={handleChange("local")} />
                </div>
            </div>

            {/* Linha 2 */}
            <div className="grid grid-cols-12 gap-x-2 gap-y-2 mb-2">
                <div className="col-span-3">
                    <TextInput label="Montadora:" value={filtros.montadora ?? ""} onChange={handleChange("montadora")} />
                </div>
                <div className="col-span-3">
                    <TextInput label="Aplicações:" value={filtros.aplicacoes ?? ""} onChange={handleChange("aplicacoes")} />
                </div>
                <div className="col-span-3">
                    <TextInput label="Data de Fabricação:" value={filtros.dataFabricacao ?? ""} onChange={handleChange("dataFabricacao")} />
                </div>
                <div className="col-span-3">
                    <TextInput label="Versão / Motor:" value={filtros.versaoMotor ?? ""} onChange={handleChange("versaoMotor")} />
                </div>
            </div>

            {/* Linha 3 */}
            <div className="grid grid-cols-12 gap-x-2 gap-y-2 mb-3">
                <div className="col-span-5">
                    <TextInput label="Fornecedor:" value={filtros.fornecedor ?? ""} onChange={handleChange("fornecedor")} />
                </div>
                <div className="col-span-2">
                    <TextInput label="MLB:" value={filtros.mlb ?? ""} onChange={handleChange("mlb")} />
                </div>
                <div className="col-span-2">
                    <TextInput label="Posição:" value={filtros.posicao ?? ""} onChange={handleChange("posicao")} />
                </div>
                <div className="col-span-3">
                    <TextInput label="Referência:" value={filtros.referencia ?? ""} onChange={handleChange("referencia")} />
                </div>
            </div>

            {/* Seção inferior */}
            <div className="flex gap-3">
                <div className="flex-1 border border-blue-300 bg-[#e8f0fe]">
                    <div className="flex border-b border-blue-300 bg-[#dce8f5]">
                        {tabBtn("medidas", "Medidas e Compactibilidade")}
                        {tabBtn("valores", "Valores Comerciais")}
                        {tabBtn("historico", "Histórico e Aplicação")}
                    </div>
                    <div className="bg-white min-h-[160px]">
                        {activeTab === "medidas" && <TabMedidas item={filtros as any} handleChange={handleChange} />}
                        {activeTab === "valores" && <TabValores item={filtros as any} handleChange={handleChange} />}
                        {activeTab === "historico" && <TabHistorico item={filtros as any} handleChange={handleChange} />}
                    </div>
                </div>

                <div className="w-64 border border-blue-300 bg-[#e8f0fe]">
                    <div className="flex border-b border-blue-300 bg-[#dce8f5]">
                        {panelBtn("ml", "Mercado Livre")}
                        {panelBtn("site", "Site")}
                    </div>
                    <div className="bg-white min-h-[160px]">
                        {activePanel === "ml" && <PanelML item={filtros as any} handleChange={handleChange} />}
                        {activePanel === "site" && <PanelSite item={filtros as any} handleChange={handleChange} />}
                    </div>
                </div>
            </div>

            {/* Rodapé */}
            <div className="flex justify-end gap-2 mt-3">
                <button
                    onClick={handleLimpar}
                    className="px-4 py-1.5 text-[11px] border border-gray-400 bg-white text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    Limpar
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-6 py-1.5 text-[11px] font-semibold text-white transition-colors"
                    style={{ backgroundColor: "#ee591f" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#d44d1a")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#ee591f")}
                >
                    🔍 Buscar
                </button>
            </div>
        </div>
    );
}