import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./useAuth";

// Altere esta senha conforme necessário
const SENHA_FIXA = import.meta.env.VITE_APP_PASSWORD;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [autenticado, setAutenticado] = useState<boolean>(() => {
    return sessionStorage.getItem("erp_auth") === "1";
  });

  const entrar = (senha: string): boolean => {
    if (senha === SENHA_FIXA) {
      sessionStorage.setItem("erp_auth", "1");
      setAutenticado(true);
      return true;
    }
    return false;
  };

  const sair = () => {
    sessionStorage.removeItem("erp_auth");
    setAutenticado(false);
  };

  return (
    <AuthContext.Provider value={{ autenticado, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}
