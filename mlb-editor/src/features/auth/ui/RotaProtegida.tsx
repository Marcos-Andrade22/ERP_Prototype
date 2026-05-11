import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/lib/useAuth";
import type { ReactNode } from "react";

export default function RotaProtegida({ children }: { children: ReactNode }) {
  const { autenticado } = useAuth();
  return autenticado ? <>{children}</> : <Navigate to="/login" replace />;
}
