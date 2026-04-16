import { useEffect, useRef, useState } from "react";
import type { CampoEstilo } from "../../../features/estoque/lib/campo-estilos-service";

// ─── Paleta de cores de texto ─────────────────────────────────
const CORES_TEXTO = [
  { label: "Vermelho", hex: "#dc2626" },
  { label: "Laranja",  hex: "#ea580c" },
  { label: "Amarelo",  hex: "#ca8a04" },
  { label: "Verde",    hex: "#16a34a" },
  { label: "Azul",     hex: "#2563eb" },
  { label: "Roxo",     hex: "#7c3aed" },
  { label: "Rosa",     hex: "#db2777" },
  { label: "Cinza",    hex: "#6b7280" },
];

// ─── Paleta de highlight ──────────────────────────────────────
const CORES_HIGHLIGHT = [
  { label: "Amarelo",  hex: "#fef08a" },
  { label: "Verde",    hex: "#bbf7d0" },
  { label: "Rosa",     hex: "#fbcfe8" },
  { label: "Azul",     hex: "#bfdbfe" },
  { label: "Laranja",  hex: "#fed7aa" },
];

interface Props {
  x: number;
  y: number;
  estilo: CampoEstilo;
  onChange: (patch: Partial<CampoEstilo>) => void;
  onClose: () => void;
}

type Submenu = "cor" | "estilo" | "highlight" | null;

export function ContextMenu({ x, y, estilo, onChange, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [submenu, setSubmenu] = useState<Submenu>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const ESTILOS_TEXTO = [
    { key: "negrito" as const,    label: "Negrito",    icon: "B",  style: { fontWeight: "bold" } },
    { key: "italico" as const,    label: "Itálico",    icon: "I",  style: { fontStyle: "italic" } },
    { key: "sublinhado" as const, label: "Sublinhado", icon: "U",  style: { textDecoration: "underline" } },
  ];

  return (
    <div
      ref={ref}
      style={{ position: "fixed", top: y, left: x, zIndex: 9999 }}
      className="bg-white border border-gray-300 shadow-lg rounded text-xs py-1 min-w-[160px] select-none"
    >
      {/* ── Item: Cor do texto ── */}
      <div
        className="relative"
        onMouseEnter={() => setSubmenu("cor")}
      >
        <button className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full border border-gray-300"
              style={{ backgroundColor: estilo.corHex ?? "transparent" }}
            />
            <span>Cor do texto</span>
          </div>
          <span className="text-gray-400 ml-4">›</span>
        </button>

        {/* Submenu Cor */}
        {submenu === "cor" && (
          <div
            className="absolute left-full top-0 bg-white border border-gray-300 shadow-lg rounded py-1 min-w-[160px] z-[10000]"
            onMouseLeave={() => setSubmenu(null)}
          >
            {/* Opção padrão */}
            <button
              onClick={() => { onChange({ corHex: null }); onClose(); }}
              className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 transition-colors"
            >
              <span className="inline-block w-3 h-3 rounded-full border border-dashed border-gray-400" />
              <span>Padrão</span>
              {!estilo.corHex && <span className="ml-auto text-gray-500">✓</span>}
            </button>

            <div className="border-t border-gray-100 my-1" />

            {CORES_TEXTO.map(({ label, hex }) => (
              <button
                key={hex}
                onClick={() => { onChange({ corHex: hex }); onClose(); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 transition-colors"
              >
                <span className="inline-block w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: hex }} />
                <span style={{ color: hex }}>{label}</span>
                {estilo.corHex === hex && <span className="ml-auto text-gray-500">✓</span>}
              </button>
            ))}

            <div className="border-t border-gray-100 my-1" />

            {/* Cor personalizada */}
            <button
              onClick={() => colorInputRef.current?.click()}
              className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 transition-colors"
            >
              <span className="inline-block w-3 h-3 rounded-full border border-gray-300 bg-gradient-to-br from-red-400 via-green-400 to-blue-400" />
              <span>Personalizada...</span>
            </button>
            <input
              ref={colorInputRef}
              type="color"
              defaultValue={estilo.corHex ?? "#000000"}
              className="sr-only"
              onChange={(e) => onChange({ corHex: e.target.value })}
              onBlur={onClose}
            />
          </div>
        )}
      </div>

      {/* ── Item: Estilo ── */}
      <div
        className="relative"
        onMouseEnter={() => setSubmenu("estilo")}
      >
        <button className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 text-center text-[9px] font-bold leading-3">A</span>
            <span>Estilo</span>
          </div>
          <span className="text-gray-400 ml-4">›</span>
        </button>

        {/* Submenu Estilo */}
        {submenu === "estilo" && (
          <div
            className="absolute left-full top-0 bg-white border border-gray-300 shadow-lg rounded py-1 min-w-[170px] z-[10000]"
            onMouseLeave={() => setSubmenu(null)}
          >
            {/* Negrito / Itálico / Sublinhado */}
            {ESTILOS_TEXTO.map(({ key, label, icon, style: s }) => (
              <button
                key={key}
                onClick={() => { onChange({ [key]: !estilo[key] }); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 transition-colors"
              >
                <span
                  className="inline-flex items-center justify-center w-4 h-4 text-[10px] border border-gray-300 rounded-sm"
                  style={estilo[key] ? { ...s, background: "#e5e7eb" } : {}}
                >
                  <span style={s}>{icon}</span>
                </span>
                <span style={estilo[key] ? s : {}}>{label}</span>
                {estilo[key] && <span className="ml-auto text-gray-500">✓</span>}
              </button>
            ))}

            <div className="border-t border-gray-100 my-1" />

            {/* Realçar */}
            <div className="px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Realçar</div>

            {/* Remover highlight */}
            <button
              onClick={() => { onChange({ highlight: null }); }}
              className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 transition-colors"
            >
              <span className="inline-block w-3 h-3 rounded-sm border border-dashed border-gray-400" />
              <span>Nenhum</span>
              {!estilo.highlight && <span className="ml-auto text-gray-500">✓</span>}
            </button>

            {CORES_HIGHLIGHT.map(({ label, hex }) => (
              <button
                key={hex}
                onClick={() => { onChange({ highlight: hex }); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 transition-colors"
              >
                <span className="inline-block w-3 h-3 rounded-sm border border-gray-200" style={{ backgroundColor: hex }} />
                <span style={{ backgroundColor: hex, padding: "0 2px" }}>{label}</span>
                {estilo.highlight === hex && <span className="ml-auto text-gray-500">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
