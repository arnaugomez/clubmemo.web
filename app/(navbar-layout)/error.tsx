"use client";
import type { ErrorPageProps } from "@/src/common/ui/models/props-with-error";
import ErrorPage from "../(admin-layout)/error";

export default function NavbarLayoutErrorPage(props: ErrorPageProps) {
  return (
    <div className="relative h-[80vh]">
      <ErrorPage {...props} />
    </div>
  );
}
