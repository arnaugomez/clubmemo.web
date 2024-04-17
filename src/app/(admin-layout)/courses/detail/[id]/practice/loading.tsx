import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { GraduationCap } from "lucide-react";

export default function PracticeLoadingPage() {
  return (
    <div className="flex size-full flex-col items-center justify-center space-y-2">
      <GraduationCap className="text-primary-500 size-8 animate-pulse" />
      <p className={cn(textStyles.base, "animate-pulse text-center")}>
        Cargando práctica...
      </p>
    </div>
  );
}
