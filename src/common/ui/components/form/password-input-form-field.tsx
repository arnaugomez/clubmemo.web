import { PasswordInput } from "../input/password-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/ui/form";
import type { InputFormFieldProps } from "./input-form-field";

export function PasswordInputFormField({
  label,
  name,
  placeholder,
  autoComplete,
}: InputFormFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <PasswordInput
              placeholder={placeholder}
              autoComplete={autoComplete}
              data-testid={name}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
