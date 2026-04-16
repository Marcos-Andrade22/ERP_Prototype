import { useCallback, useEffect, useState } from "react";
import { campoEstilosService } from "./campo-estilos-service";

export function useCampoEstilos(itemId: number | undefined) {
  const [cores, setCores] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!itemId) return;
    campoEstilosService.buscar(itemId).then(setCores).catch(console.error);
  }, [itemId]);

  const setCorCampo = useCallback(
    (campo: string, corHex: string | null) => {
      if (!itemId) return;

      // Atualiza estado local imediatamente (otimista)
      setCores(prev => {
        const next = { ...prev };
        if (corHex === null) delete next[campo];
        else next[campo] = corHex;
        return next;
      });

      // Persiste no backend
      campoEstilosService.salvar(itemId, campo, corHex).catch(console.error);
    },
    [itemId]
  );

  return { cores, setCorCampo };
}
