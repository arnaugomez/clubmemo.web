import { cn } from "@/src/common/ui/utils/shadcn";
import dayjs from "dayjs";
import { forwardRef, useEffect, useState } from "react";

export interface InputProps {
  name: string;
  id?: string;
  placeholder?: string;
  onChange: (newValue: Date | null) => void;
  value?: Date | null;
  className?: string;
}

const DateInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, name, placeholder, onChange, value, id }, ref) => {
    const [stringValue, setStringValue] = useState(value?.toDateString() ?? "");
    useEffect(() => {
      const date = new Date(stringValue);
      if (dayjs(date).isValid()) {
        onChange(date);
      } else {
        onChange(null);
      }
    }, [onChange, stringValue]);
    return (
      <input
        type="date"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        name={name}
        id={id}
        ref={ref}
        value={stringValue}
        placeholder={placeholder}
        onChange={(event) => setStringValue(event.target.value)}
      />
    );
  },
);

DateInput.displayName = "DateInput";
export { DateInput };
