import { useState } from "react";
import type { EstoqueItem } from "../model/EstoqueItem";

export function useItemForm(initialItem: EstoqueItem) {
  const [item, setItem] = useState<EstoqueItem>(initialItem);

  const handleChange = (key: keyof EstoqueItem) => (value: any) => {
    setItem((prev) => ({ ...prev, [key]: value }));
  };

  return { item, handleChange };
}
