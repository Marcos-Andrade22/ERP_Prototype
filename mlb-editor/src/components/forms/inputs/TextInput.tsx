import { useState, useCallback } from "react";
import { Field } from "../Field";
import type { InputFieldProps } from "../../../types/form";
import { ContextMenu } from "./ContextMenu";
import { ExpandedInput } from "./ExpandedInput";

interface ExtendedProps extends InputFieldProps {
  fieldName?: string;
  corHex?: string;
  onCorChange?: (corHex: string | null) => void;
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
  corHex,
  onCorChange,
  ...props
}: ExtendedProps) {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (!onCorChange) return;
      e.preventDefault();
      setMenu({ x: e.clientX, y: e.clientY });
    },
    [onCorChange]
  );

  const handleClick = useCallback(() => {
    if (disabled) return;
    setExpanded(true);
  }, [disabled]);

  const stringValue = String(value ?? "");

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
          style={{ color: corHex ?? undefined, cursor: "pointer" }}
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

      {menu && onCorChange && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          corAtual={corHex ?? null}
          onSelect={onCorChange}
          onClose={() => setMenu(null)}
        />
      )}

      {expanded && (
        <ExpandedInput
          label={label ?? fieldName ?? ""}
          value={stringValue}
          corHex={corHex}
          onSave={(val) => onChange(val)}
          onClose={() => setExpanded(false)}
        />
      )}
    </>
  );
}
