import type { Kit } from "../model/Kit";

const STORAGE_KEY = "estoque-kits-v1";

export const kitStorage = {
  save: (kits: Kit[]) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(kits)),
  load: (): Kit[] => {
    try {
      const json = localStorage.getItem(STORAGE_KEY);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  },
  delete: (id: string) => {
    const kits = kitStorage.load();
    const filtered = kits.filter((k) => k.id !== id);
    kitStorage.save(filtered);
    return filtered;
  },
};
