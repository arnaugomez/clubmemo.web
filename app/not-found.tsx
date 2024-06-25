import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import { SearchX } from "lucide-react";
import Link from "next/link";
import AdminLayout from "./(admin-layout)/layout";

/**
 * This page is shown when a user tries to access a route that does not exist.
 */
export default function NotFoundPage() {
  return (
    <AdminLayout>
      <main className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="h-2"></div>
        <SearchX className="size-8 flex-none text-slate-500" />
        <div className="h-4"></div>
        <h1 className={cn(textStyles.h3, "text-primar text-center")}>
          404 - La página no existe
        </h1>
        <div className="h-8"></div>
        <Button variant="secondary" asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
        <div className="h-2"></div>
      </main>
    </AdminLayout>
  );
}
