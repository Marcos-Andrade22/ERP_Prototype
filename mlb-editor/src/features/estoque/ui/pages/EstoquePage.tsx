import { useNavigate } from "react-router-dom";

export default function EstoquePage() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Estoque</h1>
            <p>Tela base do módulo de estoque.</p>

            <button onClick={() => navigate("/estoque/itens")}>Gerenciar itens</button>
            <button onClick={() => navigate("/estoque/busca")}>Buscar item</button>
            <button onClick={() => navigate("/kits")}>Montar kit</button>
            <button onClick={() => navigate("/dashboard")}>Voltar ao dashboard</button>
        </div>
    );
}