"use client";

import type { ErrorPageProps } from "@/src/common/ui/models/props-with-error";
import ErrorPage from "./(admin-layout)/error";

export default function GlobalErrorPage(props: ErrorPageProps) {
  return (
    <html>
      <body className="relative h-screen">
        <ErrorPage {...props} />
      </body>
    </html>
  );
}
