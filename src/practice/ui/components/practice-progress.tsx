import { cn } from "@/src/common/ui/utils/shadcn";

interface PracticeProgressProps {
  progress: number;
}

export function PracticeProgress({ progress }: PracticeProgressProps) {
  return (
    <div className="flex h-3 w-full bg-slate-50">
      <div
        className={cn(
          "bg-primary-500 h-3 bg-slate-500 transition-all duration-500",
          progress !== 1 && "rounded-r-sm",
        )}
        style={{ width: `${Math.floor(progress * 100)}%` }}
      ></div>
    </div>
  );
}
