import type { OptionModel } from "@/src/common/domain/models/option-model";
import { FormDescription, FormLabel } from "../shadcn/ui/form";
import { CheckboxInput } from "./checkbox-input";

interface CheckboxesInputProps {
  name: string;
  value: string[];
  options: OptionModel[];
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
