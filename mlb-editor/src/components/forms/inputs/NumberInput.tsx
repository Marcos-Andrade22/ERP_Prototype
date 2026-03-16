// src/components/forms/inputs/NumberInput.tsx
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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(e.target.value) || 0);
    };

    return (
        <Field label={label} required={required} error={error}>
            <input
                type="number"
                value={value}
                onChange={handleChange}
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
