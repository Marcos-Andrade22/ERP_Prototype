import { Field } from "../Field";
import type { InputFieldProps } from "../../../types/form";

// DD/MM/YYYY → YYYY-MM-DD (para o input type="date")
const toInputFormat = (value: string): string => {
    if (!value) return "";
    const parts = value.split("/");
    if (parts.length !== 3) return "";
    const [dd, mm, yyyy] = parts;
    if (!dd || !mm || !yyyy) return "";
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
};

// YYYY-MM-DD → DD/MM/YYYY (para salvar de volta)
const fromInputFormat = (value: string): string => {
    if (!value) return "";
    const parts = value.split("-");
    if (parts.length !== 3) return "";
    const [yyyy, mm, dd] = parts;
    return `${dd}/${mm}/${yyyy}`;
};

export function DateInput({
    label,
    value,
    onChange,
    required,
    disabled,
    error,
    className = "",
    ...props
}: InputFieldProps) {
    return (
        <Field label={label} required={required} error={error}>
            <input
                type="date"
                value={toInputFormat(value as string)}
                onChange={(e) => onChange(fromInputFormat(e.target.value))}
                disabled={disabled}
                className={`h-6 w-full px-2 py-1 border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${error
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