import { useNavigate } from "react-router-dom";

export default function EmitirNotasPage() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Emitir Notas</h1>
            <p>Tela base de emissão de notas.</p>

            <button onClick={() => navigate("/dashboard")}>Voltar ao dashboard</button>
        </div>
    );
}