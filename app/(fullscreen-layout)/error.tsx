"use client";

import { locator_common_ErrorTrackingService } from "@/src/common/locators/locator_error-tracking-service";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import type { ErrorPageProps } from "@/src/common/ui/models/props-with-error";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import { CircleX } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

/**
 * Shows an error message that is displayed in the pages with the Admin layout.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    locator_common_ErrorTrackingService().captureError(error);
  }, [error]);
  return (
    <main className="absolute inset-0 flex flex-col items-center justify-center px-4">
      <div className="h-2"></div>
      <CircleX className="size-8 flex-none text-slate-500" />
      <div className="h-4"></div>
      <h1 className={cn(textStyles.h3, "text-primar text-center")}>
        ¡Ha ocurrido un error!
      </h1>
      <div className="h-8"></div>
      <div className="flex space-x-4">
        <Button variant="ghost" asChild>
          <Link href="/">Inicio</Link>
        </Button>
        <Button variant="secondary" onClick={reset}>
          Reintentar
        </Button>
      </div>
      <div className="h-2"></div>
    </main>
  );
}
