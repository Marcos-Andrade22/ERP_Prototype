// src/components/forms/inputs/TextareaInput.tsx
import { Field } from "../Field";
import type { InputFieldProps } from "../../../types/form";

export function TextareaInput({
    label,
    value,
    onChange,
    required,
    disabled,
    error,
    className = "",
    rows = 4,
    ...props
}: InputFieldProps & { rows?: number }) {
    return (
        <Field label={label} required={required} error={error}>
            <textarea
                value={value as string}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                disabled={disabled}
                className={`w-full px-2 py-1 border rounded-sm text-xs resize-vertical focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${error
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
