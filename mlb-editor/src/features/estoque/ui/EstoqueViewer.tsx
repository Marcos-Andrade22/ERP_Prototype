import { useState } from "react";
import type { EstoqueItem } from "../model/EstoqueItem";
import { ItemForm } from "./ItemForm";

const emptyItem: EstoqueItem = {
    item: "",
    unid: "",
    marca: "",
    tipoRetentor: "",
    material: "",
    setor: "",
    local: "",
    marcaModelo: "",
    dataFabricacao: "",
    versaoMotor: "",
    fornecedor: "",
    quantidadeMinima: 1,
    mlb: "",
    medidaInterna: "",
    medidaExterna: "",
    altura: "",
    pesoTotal: "",
    historico: "",
    valorUnitarioFixo: "",
    valorUnitario: "",
    lucroTipo: "percent",
    lucroValor: 0,
    acrecimoPercent: 0,
    valorComercialVenda: "",
    substituicaoTributariaTipo: "percent",
    substituicaoTributariaValor: "",
    observacoesGerais: "",
    itensSimilaresCompactibilidade: "",
    aplicacoesPossiveis: "",
    imagem: "",
    situacaoML: "",
    dataAnuncioML: "",
    valorML: "",
    situacaoSite: "",
    dataAnuncioSite: "",
    valorSite: "",
    pedir: false,
    promocao: false,
    revisado: false,
    alocarParaSite: false,
    reponerSomar: false,
    rawIndex: 0,
};

export function EstoqueViewer() {
    const [selectedItem] = useState<EstoqueItem>(emptyItem);

    return (
        <div className="min-h-screen bg-[#d4d0c8] p-4">
            <ItemForm initialItem={selectedItem} />
        </div>
    );
}
