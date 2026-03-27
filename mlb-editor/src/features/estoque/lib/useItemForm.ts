import { useEffect, useState } from "react";
import type { EstoqueItem } from "../model/EstoqueItem";

// lib/useItemForm.ts

export function useItemForm(initialItem: EstoqueItem) {
  const [item, setItem] = useState<EstoqueItem>(initialItem);

  useEffect(() => {
    setItem(initialItem); // ← sincroniza quando o item externo muda
  }, [initialItem]);

  const handleChange = (key: keyof EstoqueItem) => (value: any) => {
    setItem((prev) => ({ ...prev, [key]: value }));
  };

  return { item, handleChange };
}
