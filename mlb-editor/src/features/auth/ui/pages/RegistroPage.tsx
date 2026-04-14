import { useNavigate } from "react-router-dom";

export default function RegistroPage() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Registro</h1>
            <p>Tela base de registro.</p>

            <button onClick={() => navigate("/login")}>Voltar para login</button>
        </div>
    );
}