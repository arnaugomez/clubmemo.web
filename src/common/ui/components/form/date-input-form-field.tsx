import { DateInput } from "../input/date-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/ui/form";

interface DateInputFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
}

export function DateInputFormField({
  label,
  name,
  placeholder,
}: DateInputFormFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <DateInput
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
