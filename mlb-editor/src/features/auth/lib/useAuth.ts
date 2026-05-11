import { createContext, useContext } from "react";

export interface AuthContextType {
  autenticado: boolean;
  entrar: (senha: string) => boolean;
  sair: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  autenticado: false,
  entrar: () => false,
  sair: () => {},
});

export const useAuth = () => useContext(AuthContext);
