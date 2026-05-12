import { useEffect, useRef, useState } from "react";
import type { CampoEstilo } from "../../../features/estoque/lib/campo-estilos-service";

const ESTILO_PADRAO: CampoEstilo = {
  corHex: null,
  negrito: false,
  italico: false,
  sublinhado: false,
  highlight: null,
};

interface Props {
  label: string;
  value: string;
  estilo?: CampoEstilo;
  onSave: (value: string) => void;
  onClose: () => void;
}

function removerQuebrasDeLinha(valor: string): string {
  return valor.replace(/[\r\n]+/g, "");
}

export function ExpandedInput({ label, value, estilo, onSave, onClose }: Props) {
  const [draft, setDraft] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const estiloAtivo = estilo ?? ESTILO_PADRAO;

  useEffect(() => {
    textareaRef.current?.focus();
    const len = draft.length;
    textareaRef.current?.setSelectionRange(len, len);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onSave(draft); onClose(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [draft, onSave, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) { onSave(draft); onClose(); }
  };

  const textareaStyle: React.CSSProperties = {
    color: estiloAtivo.corHex ?? undefined,
    fontWeight: estiloAtivo.negrito ? "bold" : undefined,
    fontStyle: estiloAtivo.italico ? "italic" : undefined,
    textDecoration: estiloAtivo.sublinhado ? "underline" : undefined,
    backgroundColor: estiloAtivo.highlight ?? undefined,
  };

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={handleBackdropClick}
    >
      <div className="bg-white border border-gray-400 shadow-xl rounded w-[480px] max-w-[90vw]">
        <div className="flex items-center justify-between px-3 py-2 bg-[#ececec] border-b border-gray-300">
          <span className="text-xs font-semibold text-gray-700">{label}</span>
          <button
            onClick={() => { onSave(draft); onClose(); }}
            className="text-[10px] px-2 py-1 border border-gray-400 hover:bg-gray-200 transition-colors"
          >
            Fechar
          </button>
        </div>
        <div className="p-3">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={e => setDraft(removerQuebrasDeLinha(e.target.value))}
            rows={6}
            className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            style={textareaStyle}
          />
        </div>
        <div className="px-3 pb-2 text-[10px] text-gray-400">
          Pressione <kbd className="bg-gray-100 border border-gray-300 px-1 rounded">Esc</kbd> ou clique fora para fechar
        </div>
      </div>
    </div>
  );
}