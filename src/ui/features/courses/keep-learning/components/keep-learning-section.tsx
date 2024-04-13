import { Skeleton } from "@/src/ui/components/shadcn/ui/skeleton";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { Suspense } from "react";
import { KeepLearningContent } from "./keep-learning-content";

export function KeepLearningSection() {
  return (
    <section className="px-4">
      <div className="mx-auto max-w-prose">
        <h2 className={cn(textStyles.h3, "mx-auto max-w-prose")}>
          Sigue aprendiendo
        </h2>
        <div className="h-4"></div>
        <Suspense fallback={<KeepLearningLoader />}>
          <KeepLearningContent />
        </Suspense>
      </div>
    </section>
  );
}

function KeepLearningLoader() {
  return <Skeleton className="h:64 sm:h-40" />;
}
