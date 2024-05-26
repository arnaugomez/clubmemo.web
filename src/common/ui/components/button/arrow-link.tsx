import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { textStyles } from "../../styles/text-styles";
import { cn } from "../../utils/shadcn";

interface ArrowLinkProps extends PropsWithChildren {
  href: string;
}
export function ArrowLink({ href, children }: ArrowLinkProps) {
  return (
    <Link href={href} className={cn(textStyles.mutedLink, "space-x-1 pt-1")}>
      <span>{children}</span>

      <ArrowRight size={16} className="inline" />
    </Link>
  );
}
