import { useCallback, useEffect, useRef, useState } from "react";
import type { EstoqueItem } from "../model/EstoqueItem";
import { itensService } from "./item-service";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useItemForm(initialItem: EstoqueItem) {
  const [item, setItem] = useState<EstoqueItem>(initialItem);
  const [temAlteracoes, setTemAlteracoes] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setItem(initialItem);
    setTemAlteracoes(false);
    setSaveStatus("idle");
  }, [initialItem]);

  const handleChange = (key: keyof EstoqueItem) => (value: any) => {
    setItem((prev) => ({ ...prev, [key]: value }));
    setTemAlteracoes(true);
  };

  const save = useCallback(async () => {
    if (!temAlteracoes) return;
    setSaveStatus("saving");
    try {
      if (item.id) {
        await itensService.atualizar(item.id, item);
      } else {
        await itensService.criar(item);
      }
      setTemAlteracoes(false);
      setSaveStatus("saved");
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    }
  }, [item, temAlteracoes]);

  return { item, handleChange, save, saveStatus, temAlteracoes };
}
