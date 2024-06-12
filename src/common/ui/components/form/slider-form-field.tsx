import { SliderInput } from "../input/slider-input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/ui/form";

interface SliderFormFieldProps {
  name: string;
  label: string;
  max: number;
  step?: number;
  description?: string;
}

export function SliderFormField({
  label,
  name,
  max,
  step,
  description,
}: SliderFormFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {description && <FormDescription>{description}</FormDescription>}
          <div className="h-2"></div>
          <FormControl>
            <SliderInput
              name={name}
              max={max}
              step={step}
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
