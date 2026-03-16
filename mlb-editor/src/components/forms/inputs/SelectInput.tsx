// src/components/forms/inputs/SelectInput.tsx
import { Field } from "../Field";
import type { SelectFieldProps } from "../../../types/form";

export function SelectInput({
    label,
    value,
    onChange,
    options,
    required,
    disabled,
    error,
    className = "",
    ...props
}: SelectFieldProps) {
    return (
        <Field label={label} required={required} error={error}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`h-6 w-full px-2 py-1 border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white ${error
                    ? "border-red-300 bg-red-50"
                    : disabled
                        ? "bg-gray-100 cursor-not-allowed"
                        : "border-gray-300 hover:border-gray-400"
                    } ${className}`}
                {...props}
            >
                <option value="">Selecione...</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </Field>
    );
}
