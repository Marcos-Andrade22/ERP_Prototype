import { useCallback, useEffect, useState } from "react";
import { campoEstilosService } from "./campo-estilos-service";
import type { CampoEstilo } from "./campo-estilos-service";

const ESTILO_PADRAO: CampoEstilo = {
  corHex: null,
  negrito: false,
  italico: false,
  sublinhado: false,
  highlight: null,
};

export function useCampoEstilos(itemId: number | undefined) {
  const [estilos, setEstilos] = useState<Record<string, CampoEstilo>>({});

  useEffect(() => {
    if (!itemId) return;
    campoEstilosService.buscar(itemId).then(setEstilos).catch(console.error);
  }, [itemId]);

  const setEstiloCampo = useCallback(
    (campo: string, patch: Partial<CampoEstilo>) => {
      if (!itemId) return;

      // Atualiza estado local imediatamente (otimista)
      setEstilos(prev => ({
        ...prev,
        [campo]: { ...(prev[campo] ?? ESTILO_PADRAO), ...patch },
      }));

      // Persiste no backend
      campoEstilosService.salvar(itemId, campo, patch).catch(console.error);
    },
    [itemId]
  );

  const getEstilo = useCallback(
    (campo: string): CampoEstilo => estilos[campo] ?? ESTILO_PADRAO,
    [estilos]
  );

  return { getEstilo, setEstiloCampo };
}
