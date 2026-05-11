// src/components/forms/inputs/NumberInput.tsx
import { useRef, useState, useEffect } from "react";
import { Field } from "../Field";
import type { InputFieldProps } from "../../../types/form";

export function NumberInput({
    label,
    value,
    onChange,
    required,
    disabled,
    error,
    className = "",
    ...props
}: InputFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const toDisplay = (v: unknown): string =>
        v === "" || v == null ? "" : String(v);

    const [raw, setRaw] = useState<string>(toDisplay(value));

    // Sincroniza com valor externo somente quando o campo não está em foco
    useEffect(() => {
        if (document.activeElement !== inputRef.current) {
            setRaw(toDisplay(value));
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setRaw(v);

        if (v === "" || v === "-") {
            onChange("");
            return;
        }

        // Aceita vírgula como separador decimal (padrão pt-BR)
        const normalized = v.replace(",", ".");
        const num = Number(normalized);
        onChange(isNaN(num) ? v : num);
    };

    const handleBlur = () => {
        // Ao sair do campo, normaliza o display para o valor externo
        setRaw(toDisplay(value));
    };

    return (
        <Field label={label} required={required} error={error}>
            <input
                ref={inputRef}
                // type="text" + inputMode="decimal" permite campo vazio sem
                // interferência do browser (browsers bloqueiam "" em type=number)
                type="text"
                inputMode="decimal"
                value={raw}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={disabled}
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
    );
}
