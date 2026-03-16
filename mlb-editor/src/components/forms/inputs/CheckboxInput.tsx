// src/components/forms/inputs/CheckboxInput.tsx
import { Field } from "../Field";
import type { CheckboxFieldProps } from "../../../types/form";

export function CheckboxInput({
    label,
    checked,
    onChange,
    required,
    disabled,
    error,
    className = "",
    ...props
}: CheckboxFieldProps) {
    return (
        <Field label="" className="flex items-center gap-2 p-1">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className={`h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${disabled ? "cursor-not-allowed" : "cursor-pointer"
                    } ${className}`}
                {...props}
            />
            <span className="text-sm text-gray-700">{label}</span>
        </Field>
    );
}
