import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import type { PropsWithChildren } from "react";

export function SettingsSectionTitle({ children }: PropsWithChildren) {
  return (
    <>
      <h2
        className={cn(
          textStyles.h3,
          "border-b-[1px] border-b-slate-300 text-slate-600",
        )}
      >
        {children}
      </h2>
      <div className="h-4" />
    </>
  );
}
