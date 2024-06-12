import type { ReactNode } from "react";
import { CheckboxInput } from "../input/checkbox-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../shadcn/ui/form";

interface CheckboxFormFieldProps {
  name: string;
  label: ReactNode;
}

export function CheckboxFormField({ name, label }: CheckboxFormFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <CheckboxInput
              name={field.name}
              label={label}
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
