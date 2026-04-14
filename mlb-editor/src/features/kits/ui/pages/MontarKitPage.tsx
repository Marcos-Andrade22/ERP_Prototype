import { useNavigate } from "react-router-dom";

export default function MontarKitPage() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Montar Kit</h1>
            <p>Tela base da feature de kits.</p>

            <button onClick={() => navigate("/estoque")}>Voltar ao estoque</button>
            <button onClick={() => navigate("/dashboard")}>Ir para dashboard</button>
        </div>
    );
}