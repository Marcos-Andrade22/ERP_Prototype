// src/components/forms/Field.tsx
import type { ReactNode } from "react";
import type { FieldProps } from "../../types/form";

export function Field({
    label,
    children,
    className = "",
    required = false,
    error = false,
}: FieldProps & { children: ReactNode }) {
    const labelClass = `text-[11px] font-medium text-gray-700 mb-0.5 ${required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""
        }`;

    return (
        <div className={`flex flex-col gap-0.5 ${className}`}>
            <label className={labelClass}>{label}</label>
            <div className={error ? "ring-1 ring-red-300" : ""}>{children}</div>
        </div>
    );
}
