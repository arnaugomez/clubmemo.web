import { FormDescription, FormLabel } from "../shadcn/ui/form";
import { CheckboxInput } from "./checkbox-input";

export interface Option {
  label: string;
  value: string;
}
interface CheckboxesInputProps {
  name: string;
  value: string[];
  options: Option[];
  onChange: (value: string[]) => void;
  label?: string;
  description?: string;
}

export function CheckboxesInput({
  value,
  options,
  onChange,
  label,
  description,
  name,
}: CheckboxesInputProps) {
  return (
    <>
      {(label || description) && (
        <div className="mb-4">
          {label && <FormLabel className="text-base">{label}</FormLabel>}
          {description && <FormDescription>{description}</FormDescription>}
        </div>
      )}
      {options.map((option) => {
        const checkboxName = `${name}.${option.value}`;
        return (
          <CheckboxInput
            key={option.value}
            name={checkboxName}
            value={value.includes(option.value)}
            onChange={(checked) => {
              onChange(
                checked
                  ? [...value, option.value]
                  : value.filter((e) => e !== option.value),
              );
            }}
            label={option.label}
          />
        );
      })}
    </>
  );
}
