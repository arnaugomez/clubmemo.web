import { WysiwygInput } from "../input/wysiwyg-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/ui/form";

interface WysiwygFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  isSmall?: boolean;
}

export function WysiwygFormField({
  label,
  name,
  placeholder,
  isSmall,
}: WysiwygFormFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <WysiwygInput
              id={field.name}
              onChange={field.onChange}
              name={field.name}
              value={field.value}
              placeholder={placeholder}
              isSmall={isSmall}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
