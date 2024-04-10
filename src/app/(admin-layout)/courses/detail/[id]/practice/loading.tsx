import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { GraduationCap } from "lucide-react";

export default function PracticeLoadingPage() {
  return (
    <div className="size-full flex flex-col space-y-2 items-center justify-center">
      <GraduationCap className="size-8 text-primary-500 animate-pulse" />
      <p className={cn(textStyles.base, "text-center animate-pulse")}>
        Cargando práctica...
      </p>
    </div>
  );
}
