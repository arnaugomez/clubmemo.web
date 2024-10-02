import { NumberInput } from "../input/number-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/ui/form";

interface NumberInputFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
}

export function NumberInputFormField({
  label,
  name,
  placeholder,
}: NumberInputFormFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <NumberInput
              name={name}
              id={field.name}
              placeholder={placeholder}
              value={field.value}
              onChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
