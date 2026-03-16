// src/components/TestForm.tsx
import React, { useState } from "react";

// Tipos (temporários para teste)
type FormData = {
    item: string;
    quantidade: number;
    dataFab: string;
    descricao: string;
    pedir: boolean;
};

// Field genérico
function Field({
    label,
    children,
    required = false,
    error = false,
}: {
    label: string;
    children: React.ReactNode;
    required?: boolean;
    error?: boolean;
}) {
    return (
        <div className="flex flex-col gap-0.5 mb-3">
            <label className={`text-[11px] font-medium text-gray-700 ${required ? "after:content-['*'] after:text-red-500" : ""}`}>
                {label}
            </label>
            <div className={error ? "ring-1 ring-red-300" : ""}>{children}</div>
        </div>
    );
}

// TextInput
function TextInput({
    label,
    value,
    onChange,
    placeholder,
    required,
    disabled,
    error,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
}) {
    return (
        <Field label={label} required={required} error={error}>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={`h-6 w-full px-2 py-1 border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all ${error
                    ? "border-red-300 bg-red-50"
                    : disabled
                        ? "bg-gray-100 cursor-not-allowed border-gray-300"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
            />
        </Field>
    );
}

// NumberInput
function NumberInput({
    label,
    value,
    onChange,
    required,
}: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    required?: boolean;
}) {
    return (
        <Field label={label} required={required}>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(Number(e.target.value) || 0)}
                className="h-6 w-full px-2 py-1 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all"
            />
        </Field>
    );
}

// DateInput
function DateInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <Field label={label}>
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-6 w-full px-2 py-1 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all"
            />
        </Field>
    );
}

// CheckboxInput
function CheckboxInput({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <Field label="">
            <label className="flex items-center gap-2 p-1 cursor-pointer hover:bg-gray-50 rounded-sm transition-colors">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <span className="text-sm text-gray-700 font-medium">{label}</span>
            </label>
        </Field>
    );
}

// TextareaInput
function TextareaInput({
    label,
    value,
    onChange,
    rows = 4,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
}) {
    return (
        <Field label={label}>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                className="w-full px-2 py-1 border border-gray-300 rounded-sm text-xs resize-vertical focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all min-h-[80px]"
            />
        </Field>
    );
}

export function TestForm() {
    const [formData, setFormData] = useState<FormData>({
        item: "",
        quantidade: 1,
        dataFab: "",
        descricao: "",
        pedir: false,
    });

    const handleChange = (key: keyof FormData) => (value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-200 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
                🧪 Teste dos Campos - Funcionando!
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* TextInput */}
                <TextInput
                    label="Item *"
                    value={formData.item}
                    onChange={handleChange("item")}
                    placeholder="Digite o nome do item"
                    required
                />

                {/* NumberInput */}
                <NumberInput
                    label="Quantidade mínima"
                    value={formData.quantidade}
                    onChange={handleChange("quantidade")}
                />

                {/* DateInput */}
                <DateInput
                    label="Data Fabricação"
                    value={formData.dataFab}
                    onChange={handleChange("dataFab")}
                />

                {/* Checkbox */}
                <CheckboxInput
                    label="Pedir"
                    checked={formData.pedir}
                    onChange={handleChange("pedir")}
                />
            </div>

            {/* Textarea - full width */}
            <div className="md:col-span-2">
                <TextareaInput
                    label="Histórico/Descrição"
                    value={formData.descricao}
                    onChange={handleChange("descricao")}
                    rows={4}
                />
            </div>

            {/* Estados especiais */}
            <div className="space-y-4 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
                <h3 className="font-semibold text-red-800 text-lg">🔴 Testes Especiais</h3>
                <TextInput
                    label="Erro (vazio)"
                    value=""
                    onChange={() => { }}
                    error
                />
                <TextInput
                    label="Desabilitado"
                    value="Conteúdo fixo"
                    onChange={() => { }}
                    disabled
                />
            </div>

            {/* Preview dos dados */}
            <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl">
                <h3 className="font-semibold text-green-800 mb-3">📊 Dados em tempo real:</h3>
                <pre className="text-xs bg-white p-4 rounded-lg overflow-auto font-mono text-green-900">
                    {JSON.stringify(formData, null, 2)}
                </pre>
            </div>
        </div>
    );
}
