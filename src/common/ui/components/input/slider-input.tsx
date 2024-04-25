import { useState } from "react";
import { textStyles } from "../../styles/text-styles";
import { cn } from "../../utils/shadcn";
import { Slider } from "../shadcn/ui/slider";

interface SliderInputProps {
  name: string;
  value: number;
  onChange: (value: number) => void;
  max: number;
  step?: number;
}
export function SliderInput({
  value,
  onChange,
  max,
  step,
  name,
}: SliderInputProps) {
  const [displayValue, setDisplayValue] = useState(value);
  return (
    <>
      <Slider
        name={name}
        defaultValue={[value]}
        onValueCommit={(e) => onChange(e[0])}
        onValueChange={(e) => setDisplayValue(e[0])}
        max={max}
        step={step}
      />
      <div className={cn(textStyles.muted, "text-center")}>{displayValue}</div>
    </>
  );
}
