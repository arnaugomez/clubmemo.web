"use client";
import type { ErrorPageProps } from "@/src/common/ui/models/props-with-error";
import ErrorPage from "../(fullscreen-layout)/error";

/**
 * Displays a page with an error message. It is shown when an error occurs in
 * the components inside the `NavbarLayout` component.
 */
export default function NavbarLayoutErrorPage(props: ErrorPageProps) {
  return (
    <div className="relative h-[80vh]">
      <ErrorPage {...props} />
    </div>
  );
}
