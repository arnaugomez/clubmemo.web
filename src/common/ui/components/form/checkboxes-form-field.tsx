import type { OptionModel } from "@/src/common/domain/models/option-model";
import { CheckboxesInput } from "../input/checkboxes-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../shadcn/ui/form";

interface CheckboxesFormFieldProps {
  name: string;
  label: string;
  description: string;
  options: OptionModel[];
}

export function CheckboxesFormField({
  name,
  label,
  description,
  options,
}: CheckboxesFormFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <CheckboxesInput
              label={label}
              description={description}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              options={options}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
