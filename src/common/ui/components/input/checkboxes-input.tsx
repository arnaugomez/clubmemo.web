import { Checkbox } from "../shadcn/ui/checkbox";
import { FormDescription, FormLabel } from "../shadcn/ui/form";

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
          <div
            key={option.value}
            className="flex flex-row items-start space-x-3 space-y-0"
          >
            <Checkbox
              name={checkboxName}
              id={checkboxName}
              checked={value.includes(option.value)}
              onCheckedChange={(checked) => {
                onChange(
                  checked
                    ? [...value, option.value]
                    : value.filter((e) => e !== option.value),
                );
              }}
            />
            <FormLabel htmlFor={checkboxName} className="font-normal">
              {option.label}
            </FormLabel>
          </div>
        );
      })}
    </>
  );
}
