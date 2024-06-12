import TagsInput from "../input/tags-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/ui/form";

interface TagsFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
}

export function TagsFormField({
  label,
  name,
  placeholder,
}: TagsFormFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <TagsInput
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
