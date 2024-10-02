import type { OptionModel } from "@/src/common/domain/models/option-model";
import { SelectInput } from "../input/select-input";
import { SelectMultipleInput } from "../input/select-multiple-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/ui/form";

interface SelectFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  options: OptionModel[];
  disabled?: boolean;
  isMultiple?: boolean;
}

export function SelectFormField({
  label,
  name,
  options,
  placeholder,
  disabled,
  isMultiple,
}: SelectFormFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {isMultiple ? (
              <SelectMultipleInput
                name={name}
                id={field.name}
                options={options}
                disabled={disabled}
                placeholder={placeholder}
                value={field.value}
                onChange={field.onChange}
              />
            ) : (
              <SelectInput
                name={name}
                id={field.name}
                options={options}
                disabled={disabled}
                placeholder={placeholder}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
