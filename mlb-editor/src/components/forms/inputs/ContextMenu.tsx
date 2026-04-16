import { useEffect, useRef } from "react";

const CORES = [
  { label: "Padrão",  hex: null },
  { label: "Vermelho", hex: "#dc2626" },
  { label: "Laranja",  hex: "#ea580c" },
  { label: "Amarelo",  hex: "#ca8a04" },
  { label: "Verde",    hex: "#16a34a" },
  { label: "Azul",     hex: "#2563eb" },
  { label: "Roxo",     hex: "#7c3aed" },
  { label: "Rosa",     hex: "#db2777" },
  { label: "Cinza",    hex: "#6b7280" },
];

interface Props {
  x: number;
  y: number;
  corAtual: string | null;
  onSelect: (corHex: string | null) => void;
  onClose: () => void;
}

export function ContextMenu({ x, y, corAtual, onSelect, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Fecha ao pressionar Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Ajusta posição para não sair da tela
  const style: React.CSSProperties = {
    position: "fixed",
    top: y,
    left: x,
    zIndex: 9999,
  };

  return (
    <div
      ref={ref}
      style={style}
      className="bg-white border border-gray-300 shadow-lg rounded text-xs py-1 min-w-[140px]"
    >
      <div className="px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
        Cor do texto
      </div>

      {CORES.map(({ label, hex }) => (
        <button
          key={label}
          onClick={() => { onSelect(hex); onClose(); }}
          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 text-left transition-colors"
        >
          {/* Bolinha de cor */}
          <span
            className="inline-block w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
            style={{ backgroundColor: hex ?? "transparent" }}
          />
          <span style={{ color: hex ?? "inherit" }}>{label}</span>
          {/* Checkmark se for a cor atual */}
          {(hex === corAtual || (hex === null && !corAtual)) && (
            <span className="ml-auto text-gray-500">✓</span>
          )}
        </button>
      ))}
    </div>
  );
}
