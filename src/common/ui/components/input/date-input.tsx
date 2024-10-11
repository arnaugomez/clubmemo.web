import { cn } from "@/src/common/ui/utils/shadcn";
import { formatDate, isDate, isValid } from "date-fns";
import { forwardRef, useEffect, useRef, useState } from "react";

export interface InputProps {
  name: string;
  id?: string;
  placeholder?: string;
  onChange: (newValue: Date | null) => void;
  value?: Date | null;
  className?: string;
}

function stringToDate(value: string): Date | null {
  const date = new Date(value);
  if (isValid(date)) {
    return date;
  } else {
    return null;
  }
}

const DateInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, name, placeholder, onChange, value, id }, ref) => {
    const [stringValue, setStringValue] = useState("");

    const avoidUpdateTimeout = useRef<NodeJS.Timeout>();
    const avoidUpdate = useRef(false);

    useEffect(() => {
      if (value !== stringToDate(stringValue) && !avoidUpdate.current) {
        setStringValue(
          value && isDate(value) ? formatDate(value, "yyyy-MM-dd") : "",
        );
      }
    }, [stringValue, value]);

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
        onChange={(event) => {
          clearTimeout(avoidUpdateTimeout.current);
          avoidUpdate.current = true;

          const value = event.target.value;
          onChange(stringToDate(value));
          setStringValue(value);

          avoidUpdateTimeout.current = setTimeout(() => {
            avoidUpdate.current = true;
          }, 500);
        }}
        formNoValidate
      />
    );
  },
);

DateInput.displayName = "DateInput";
export { DateInput };
