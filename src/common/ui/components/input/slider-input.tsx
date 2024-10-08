import { textStyles } from "../../styles/text-styles";
import { cn } from "../../utils/shadcn";
import { Slider } from "../shadcn/ui/slider";

interface SliderInputProps {
  name: string;
  value: number | null;
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
  return (
    <>
      <Slider
        name={name}
        value={[value ?? 0]}
        onValueChange={(e) => onChange(e[0] ?? 0)}
        max={max}
        step={step}
      />
      <div className={cn(textStyles.muted, "text-center")}>{value ?? 0}</div>
    </>
  );
}
