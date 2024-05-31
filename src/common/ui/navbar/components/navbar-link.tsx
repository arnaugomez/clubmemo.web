"use client";

import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function NavbarLink({ href, children, className }: NavbarLinkProps) {
  const isCurrent = usePathname() === href;

  return (
    <Link
      className={cn(
        textStyles.muted,
        "hover:text-slate-700",
        isCurrent && "text-slate-700",
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
