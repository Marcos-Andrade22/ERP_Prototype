import { useCallback, useEffect, useRef, useState } from "react";
import type { EstoqueItem } from "../model/EstoqueItem";
import { itensService } from "./item-service";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useItemForm(initialItem: EstoqueItem) {
  const [item, setItem] = useState<EstoqueItem>(initialItem);
  const [temAlteracoes, setTemAlteracoes] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs sempre atualizadas com os valores mais recentes
  const itemRef = useRef(item);
  const temAlteracoesRef = useRef(temAlteracoes);
  itemRef.current = item;
  temAlteracoesRef.current = temAlteracoes;

  // Reseta apenas quando trocar de item (ID diferente)
  useEffect(() => {
    setItem(initialItem);
    setTemAlteracoes(false);
    setSaveStatus("idle");
  }, [initialItem.id]);

  // Salva ao desmontar (ex: navegar para outra tela)
  useEffect(() => {
    return () => {
      if (temAlteracoesRef.current && itemRef.current?.id) {
        itensService.atualizar(itemRef.current.id, itemRef.current);
      }
    };
  }, []);

  const handleChange = (key: keyof EstoqueItem) => (value: any) => {
    setItem((prev) => ({ ...prev, [key]: value }));
    setTemAlteracoes(true);
  };

  const save = useCallback(async () => {
    // Lê sempre da ref — nunca stale
    if (!temAlteracoesRef.current) return;
    const currentItem = itemRef.current;

    setSaveStatus("saving");
    try {
      if (currentItem.id) {
        await itensService.atualizar(currentItem.id, currentItem);
      } else {
        await itensService.criar(currentItem);
      }
      setTemAlteracoes(false);
      setSaveStatus("saved");
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    }
  }, []);

  return { item, handleChange, save, saveStatus, temAlteracoes };
}
