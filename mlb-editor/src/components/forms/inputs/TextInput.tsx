// src/components/forms/inputs/TextInput.tsx
import { Field } from "../Field";
import type { InputFieldProps } from "../../../types/form";

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
    ...props
}: InputFieldProps) {
    return (
        <Field label={label} required={required} error={error}>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
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
