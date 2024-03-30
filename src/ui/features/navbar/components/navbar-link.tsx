"use client";

import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarLinkProps {
  href: string;
  children: React.ReactNode;
}

export function NavbarLink({ href, children }: NavbarLinkProps) {
  const isCurrent = usePathname() === href;

  return (
    <Link
      className={cn(
        textStyles.muted,
        "hover:text-slate-700",
        isCurrent && "text-slate-700",
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
