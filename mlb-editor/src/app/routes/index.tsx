import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "../../features/auth/ui/pages/LoginPage";
import RotaProtegida from "../../features/auth/ui/RotaProtegida";

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
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <RotaProtegida>
              <DashboardPage />
            </RotaProtegida>
          }
        />

        <Route
          path="/estoque"
          element={
            <RotaProtegida>
              <EstoquePage />
            </RotaProtegida>
          }
        />
        <Route
          path="/estoque/busca"
          element={
            <RotaProtegida>
              <BuscaPage />
            </RotaProtegida>
          }
        />
        <Route
          path="/estoque/novo"
          element={
            <RotaProtegida>
              <NovoItemPage />
            </RotaProtegida>
          }
        />
        <Route
          path="/estoque/resultados"
          element={
            <RotaProtegida>
              <ResultadosBuscaPage />
            </RotaProtegida>
          }
        />
        <Route
          path="/estoque/item/:id"
          element={
            <RotaProtegida>
              <ItemPage />
            </RotaProtegida>
          }
        />

        <Route
          path="/kits"
          element={
            <RotaProtegida>
              <MontarKitPage />
            </RotaProtegida>
          }
        />

        <Route
          path="/emitir-notas"
          element={
            <RotaProtegida>
              <EmitirNotasPage />
            </RotaProtegida>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
