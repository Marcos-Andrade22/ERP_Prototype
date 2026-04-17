import { useState, useCallback } from "react";
import { Field } from "../Field";
import type { InputFieldProps } from "../../../types/form";
import { ContextMenu } from "./ContextMenu";
import { ExpandedInput } from "./ExpandedInput";
import type { CampoEstilo } from "../../../features/estoque/lib/campo-estilos-service";

const ESTILO_PADRAO: CampoEstilo = {
  corHex: null,
  negrito: false,
  italico: false,
  sublinhado: false,
  highlight: null,
};

interface ExtendedProps extends InputFieldProps {
  fieldName?: string;
  estilo?: CampoEstilo;
  onEstiloChange?: (patch: Partial<CampoEstilo>) => void;
}

export function TextInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  disabled,
  error,
  className = "",
  fieldName,
  estilo,
  onEstiloChange,
  ...props
}: ExtendedProps) {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [expanded, setExpanded] = useState(false);

  const estiloAtivo = estilo ?? ESTILO_PADRAO;

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (!onEstiloChange) return;
      e.preventDefault();
      setMenu({ x: e.clientX, y: e.clientY });
    },
    [onEstiloChange]
  );

  const handleClick = useCallback(() => {
    if (disabled) return;
    setExpanded(true);
  }, [disabled]);

  const stringValue = String(value ?? "");

  // Monta o style dinâmico do input
  const inputStyle: React.CSSProperties = {
    color: estiloAtivo.corHex ?? undefined,
    fontWeight: estiloAtivo.negrito ? "bold" : undefined,
    fontStyle: estiloAtivo.italico ? "italic" : undefined,
    textDecoration: estiloAtivo.sublinhado ? "underline" : undefined,
    backgroundColor: estiloAtivo.highlight ?? undefined,
    cursor: "pointer",
  };

  return (
    <>
      <Field label={label} required={required} error={error}>
        <input
          type={type}
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          style={inputStyle}
          className={`h-6 w-full px-2 py-1 border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            error
              ? "border-red-300 bg-red-50"
              : disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "border-gray-300 hover:border-gray-400"
          } ${className}`}
          {...props}
        />
      </Field>

      {menu && onEstiloChange && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          estilo={estiloAtivo}
          onChange={(patch) => onEstiloChange(patch)}
          onClose={() => setMenu(null)}
        />
      )}

      {expanded && (
        <ExpandedInput
          label={label ?? fieldName ?? ""}
          value={stringValue}
          estilo={estiloAtivo}
          onSave={(val) => onChange(val)}
          onClose={() => setExpanded(false)}
        />
      )}
    </>
  );
}
