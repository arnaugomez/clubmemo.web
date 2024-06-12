import { Switch } from "@radix-ui/react-switch";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../shadcn/ui/form";

interface SwitchSectionFormFieldProps {
  name: string;
  label: string;
  description: string;
}

export function SwitchSectionFormField({
  name,
  label,
  description,
}: SwitchSectionFormFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between space-x-4 rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
