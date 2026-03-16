// src/types/form.ts
export type FieldVariant =
  | "default"
  | "number"
  | "date"
  | "select"
  | "textarea"
  | "checkbox";

export interface FieldProps {
  label: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

export interface InputFieldProps extends FieldProps {
  type?: "text" | "number" | "date" | "email" | "password";
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
}

export interface CheckboxFieldProps extends FieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export interface SelectFieldProps extends FieldProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}
