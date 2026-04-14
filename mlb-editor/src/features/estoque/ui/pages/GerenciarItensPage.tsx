import { useNavigate } from "react-router-dom";

export default function GerenciarItensPage() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Gerenciar Itens</h1>
            <p>Tela base de gerenciamento de itens.</p>

            <button onClick={() => navigate("/estoque")}>Voltar ao estoque</button>
        </div>
    );
}