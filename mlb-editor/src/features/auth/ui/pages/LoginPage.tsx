import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Login</h1>
            <p>Tela base de login.</p>

            <button onClick={() => navigate("/dashboard")}>Entrar</button>
            <button onClick={() => navigate("/registro")}>Ir para registro</button>
        </div>
    );
}