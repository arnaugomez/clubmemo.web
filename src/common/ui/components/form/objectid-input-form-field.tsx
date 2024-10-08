import type { AdminResourceTypeModel } from "@/src/admin/domain/models/admin-resource-model";
import { ObjectIdInput } from "../input/objectid-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/ui/form";
import type { InputFormFieldProps } from "./input-form-field";

export interface ObjectIdInputFormFieldProps extends InputFormFieldProps {
  resourceType?: AdminResourceTypeModel;
}

export function ObjectIdInputFormField({
  label,
  name,
  placeholder,
  autoComplete,
  resourceType,
}: ObjectIdInputFormFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <ObjectIdInput
              resourceType={resourceType}
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
