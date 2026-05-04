import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "../../features/auth/ui/pages/LoginPage";
import RegistroPage from "../../features/auth/ui/pages/RegistroPage";

import DashboardPage from "../../features/dashboard/ui/pages/DashboardPage";

import EstoquePage from "../../features/estoque/ui/pages/EstoquePage";
import BuscaPage from "../../features/estoque/ui/pages/BuscaPage";
import ResultadosBuscaPage from "../../features/estoque/ui/pages/ResultadosBuscaPage";
import ItemPage from "../../features/estoque/ui/pages/ItemPage";
import NovoItemPage from "../../features/estoque/ui/pages/NovoItemPage";

import MontarKitPage from "../../features/kits/ui/pages/MontarKitPage";

import EmitirNotasPage from "../../features/notas/ui/pages/EmitirNotasPage";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/registro" element={<RegistroPage />} />

                <Route path="/dashboard" element={<DashboardPage />} />

                <Route path="/estoque" element={<EstoquePage />} />
                <Route path="/estoque/busca" element={<BuscaPage />} />
                <Route path="/estoque/novo" element={<NovoItemPage />} />
                <Route path="/estoque/resultados" element={<ResultadosBuscaPage />} />
                <Route path="/estoque/item/:id" element={<ItemPage />} />

                <Route path="/kits" element={<MontarKitPage />} />

                <Route path="/emitir-notas" element={<EmitirNotasPage />} />

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
