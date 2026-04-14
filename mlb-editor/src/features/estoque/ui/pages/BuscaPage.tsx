import { useNavigate } from "react-router-dom";
import { SearchForm } from "../../ui/SearchForm";
import type { EstoqueItem } from "../../model/EstoqueItem";

const campoParaParam: Partial<Record<keyof EstoqueItem, string>> = {
    codigoItem: "codigoItem",
    item: "item",
    marca: "marca",
    referencia: "referencia",
    fornecedor: "fornecedor",
    mlb: "mlb",
    setor: "setor",
    local: "local",
    material: "material",
    tipoRetentor: "tipo_retentor",
    versaoMotor: "versao_motor",
    montadora: "montadora",
    sentido: "sentido",
    revisado: "revisado",
};

export default function BuscaPage() {
    const navigate = useNavigate();

    const handleSearch = (filtros: Partial<EstoqueItem>) => {
        const params = new URLSearchParams();
        for (const [key, paramName] of Object.entries(campoParaParam)) {
            const valor = filtros[key as keyof EstoqueItem];
            if (valor !== undefined && valor !== "" && valor !== null) {
                params.set(paramName, String(valor));
            }
        }
        navigate(`/busca/resultados?${params.toString()}`);
    };

    return (
        <div className="min-h-screen p-4 space-y-3" style={{ backgroundColor: "#d4d0c8" }}>
            <div
                className="flex items-center gap-3 px-4 py-3 text-white font-sans"
                style={{ backgroundColor: "#22252A" }}
            >
                <span className="text-lg font-bold" style={{ color: "#ee591f" }}>🔍</span>
                <div>
                    <p className="text-sm font-semibold">MODO BUSCA</p>
                    <p className="text-[11px] opacity-70">
                        Preencha os campos desejados e clique em Buscar. Campos em branco são ignorados.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/estoque")}
                    className="ml-auto text-[11px] px-3 py-1.5 border border-white/30 hover:bg-white/10 transition-colors"
                >
                    ← Voltar ao Estoque
                </button>
            </div>

            <SearchForm onSearch={handleSearch} />
        </div>
    );
}