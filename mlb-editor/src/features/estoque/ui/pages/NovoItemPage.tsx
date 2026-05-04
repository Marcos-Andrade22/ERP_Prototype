import { useNavigate } from "react-router-dom";
import { ItemForm } from "../ItemForm";
import type { EstoqueItem } from "../../model/EstoqueItem";

const emptyItem: EstoqueItem = {
    codigoItem: '', item: '', unid: '', marca: '', tipoRetentor: '', material: '',
    sentido: '', setor: '', local: '', montadora: '', aplicacoes: '',
    dataFabricacao: '', versaoMotor: '', aplicacoesPossiveis: '',
    fornecedor: '', garantia: '', quantidade: 0, quantidadeMinima: 1,
    mlb: '', posicao: '', conversao: '', referencia: '',
    medidaInterna: '', medidaExterna: '', altura: '', pesoTotal: '',
    historico: '', valorUnitarioFixo: '', valorUnitario: '',
    valorComercialVenda: '', substituicaoTributariaValor: '',
    lucroTipo: 'percent', lucroValor: 0, acrescimoPercent: 0,
    observacoesGerais: '', itensSimilaresCompactibilidade: '',
    situacaoML: '', dataAnuncioML: '', valorML: '',
    situacaoSite: '', dataAnuncioSite: '', valorSite: '',
    pedir: false, promocao: false, revisado: '', alocarParaSite: '',
    reporeSomar: '', imagem: '', rawIndex: 0, substituicaoTributariaTipo: 'percent', frete: '', taxaClienteOficina: 0
};

export default function NovoItemPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#d4d0c8] font-sans">
            {/* Topbar */}
            <div
                className="flex items-center justify-between px-5 py-3 text-white"
                style={{ backgroundColor: "#22252A" }}
            >
                <div>
                    <span className="text-base font-bold tracking-widest" style={{ color: "#ee591f" }}>SÓ IMPORTADOS</span>
                    <span className="ml-3 text-[11px] opacity-50 tracking-wider">NOVO ITEM</span>
                </div>
                <button
                    onClick={() => navigate("/estoque")}
                    className="text-[11px] px-3 py-1.5 border border-white/30 hover:bg-white/10 transition-colors"
                >
                    ← Estoque
                </button>
            </div>

            <div className="p-4">
                <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-3">
                    Cadastrar Novo Item
                </p>
                <ItemForm
                    key="novo-item"
                    initialItem={emptyItem}
                    isNew
                    onSaveSuccess={(id) => navigate(`/estoque/item/${id}`)}
                />
            </div>
        </div>
    );
}
