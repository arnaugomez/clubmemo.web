"use client";

import type { ErrorPageProps } from "@/src/common/ui/models/props-with-error";
import { inter } from "@/src/common/ui/styles/fonts";
import { cn } from "@/src/common/ui/utils/shadcn";
import ErrorPage from "./(admin-layout)/error";

/**
 * Error page that is shown when an error occurs in the `RootLayout` component.
 * @see RootLayout
 */
export default function GlobalErrorPage(props: ErrorPageProps) {
  return (
    <html>
      <body className={cn(inter.className, "relative h-screen antialiased")}>
        <ErrorPage {...props} />
      </body>
    </html>
  );
}
