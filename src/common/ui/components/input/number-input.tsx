import { cn } from "@/src/common/ui/utils/shadcn";
import { forwardRef, useEffect, useState } from "react";

export interface InputProps {
  name: string;
  id?: string;
  placeholder?: string;
  onChange: (newValue: number | null) => void;
  value?: number | null;
  className?: string;
}

function stringToNumber(value: string): number | null {
  const numberValue = Number(value);
  if (isNaN(numberValue)) {
    return null;
  } else {
    return numberValue;
  }
}

const NumberInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, name, placeholder, onChange, value, id }, ref) => {
    const [stringValue, setStringValue] = useState("");

    useEffect(() => {
      if (value !== stringToNumber(stringValue)) {
        setStringValue(value?.toString() ?? "");
      }
    }, [stringValue, value]);

    return (
      <input
        type="number"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        name={name}
        id={id}
        ref={ref}
        value={stringValue}
        placeholder={placeholder}
        onChange={(event) => {
          const value = event.target.value;
          onChange(stringToNumber(value));
          setStringValue(value);
        }}
        formNoValidate
      />
    );
  },
);

NumberInput.displayName = "NumberInput";
export { NumberInput };
