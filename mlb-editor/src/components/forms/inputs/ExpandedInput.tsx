import { useEffect, useRef, useState } from "react";

interface Props {
  label: string;
  value: string;
  corHex?: string;
  onSave: (value: string) => void;
  onClose: () => void;
}

export function ExpandedInput({ label, value, corHex, onSave, onClose }: Props) {
  const [draft, setDraft] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Foca o textarea ao abrir
  useEffect(() => {
    textareaRef.current?.focus();
    // Posiciona cursor no final
    const len = draft.length;
    textareaRef.current?.setSelectionRange(len, len);
  }, []);

  // Fecha com Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onSave(draft);
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [draft, onSave, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onSave(draft);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={handleBackdropClick}
    >
      <div className="bg-white border border-gray-400 shadow-xl rounded w-[480px] max-w-[90vw]">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#ececec] border-b border-gray-300">
          <span className="text-xs font-semibold text-gray-700">{label}</span>
          <button
            onClick={() => { onSave(draft); onClose(); }}
            className="text-[10px] px-2 py-1 border border-gray-400 hover:bg-gray-200 transition-colors"
          >
            Fechar
          </button>
        </div>

        {/* Textarea */}
        <div className="p-3">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            style={{ color: corHex ?? "inherit" }}
          />
        </div>

        <div className="px-3 pb-2 text-[10px] text-gray-400">
          Pressione <kbd className="bg-gray-100 border border-gray-300 px-1 rounded">Esc</kbd> ou clique fora para fechar
        </div>
      </div>
    </div>
  );
}
