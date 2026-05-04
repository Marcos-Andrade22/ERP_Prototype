import { useCallback, useEffect, useRef, useState } from "react";
import type { EstoqueItem } from "../model/EstoqueItem";
import { itensService } from "./item-service";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseItemFormOptions {
  isNew?: boolean;
  onSaveSuccess?: (id: number) => void;
}

export function useItemForm(initialItem: EstoqueItem, options: UseItemFormOptions = {}) {
  const { isNew, onSaveSuccess } = options;
  const [item, setItem] = useState<EstoqueItem>(initialItem);
  const [temAlteracoes, setTemAlteracoes] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const itemRef = useRef(item);
  const temAlteracoesRef = useRef(temAlteracoes);
  itemRef.current = item;
  temAlteracoesRef.current = temAlteracoes;

  useEffect(() => {
    setItem(initialItem);
    setTemAlteracoes(false);
    setSaveStatus("idle");
  }, [initialItem.id]);

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
    if (!temAlteracoesRef.current) return;
    const currentItem = itemRef.current;

    setSaveStatus("saving");
    try {
      if (currentItem.id) {
        await itensService.atualizar(currentItem.id, currentItem);
      } else {
        const criado = await itensService.criar(currentItem);
        const novoId = criado?.id ?? criado?.data?.id;
        if (novoId && onSaveSuccess) {
          onSaveSuccess(novoId);
          return;
        }
      }
      setTemAlteracoes(false);
      setSaveStatus("saved");
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    }
  }, [onSaveSuccess]);

  return { item, handleChange, save, saveStatus, temAlteracoes };
}
