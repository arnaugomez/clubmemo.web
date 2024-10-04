import type { ReactNode } from "react";
import { Checkbox } from "../shadcn/ui/checkbox";
import { FormLabel } from "../shadcn/ui/form";

interface CheckboxInputProps {
  name: string;
  label: ReactNode;
  value: boolean | null;
  onChange: (value: boolean | null) => void;
  "data-testid"?: string;
}

export function CheckboxInput({
  name,
  label,
  value,
  onChange,
  ...props
}: CheckboxInputProps) {
  return (
    <div className="flex flex-row items-start space-x-3 space-y-0">
      <Checkbox
        name={name}
        id={name}
        checked={value ?? "indeterminate"}
        onCheckedChange={(checked) =>
          onChange(checked === "indeterminate" ? null : checked)
        }
        data-testid={props["data-testid"]}
      />
      <FormLabel htmlFor={name} className="font-normal leading-tight">
        {label}
      </FormLabel>
    </div>
  );
}
