import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { PropsWithChildren } from "react";

export function SettingsSectionTitle({ children }: PropsWithChildren) {
  return (
    <>
      <h2
        className={cn(
          textStyles.h3,
          "border-b-[1px] text-slate-600 border-b-slate-300",
        )}
      >
        {children}
      </h2>
      <div className="h-4" />
    </>
  );
}
