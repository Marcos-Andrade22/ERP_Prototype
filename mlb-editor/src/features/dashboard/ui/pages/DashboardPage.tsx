import { useNavigate } from "react-router-dom";
import PendenciasPanel from "../panels/PendenciasPanel";

export default function DashboardPage() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Tela base do dashboard.</p>

            <button onClick={() => navigate("/estoque")}>Ir para estoque</button>
            <button onClick={() => navigate("/kits")}>Ir para kits</button>
            <button onClick={() => navigate("/emitir-notas")}>Ir para emitir notas</button>

            <PendenciasPanel />
        </div>
    );
}