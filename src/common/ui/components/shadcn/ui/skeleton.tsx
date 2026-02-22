import type { HTMLAttributes, RefAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "@/src/common/ui/utils/shadcn";

const Skeleton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref?: RefAttributes<HTMLDivElement>["ref"]) => {
    return (
      <div
        className={cn("animate-pulse rounded-md bg-muted", className)}
        {...props}
        ref={ref}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
