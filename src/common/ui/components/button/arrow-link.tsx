import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { textStyles } from "../../styles/text-styles";
import { cn } from "../../utils/shadcn";

interface ArrowLinkProps extends PropsWithChildren {
  href: string;
  isLeft?: boolean;
}
export function ArrowLink({ href, children, isLeft }: ArrowLinkProps) {
  return (
    <Link href={href} className={cn(textStyles.mutedLink, "space-x-1 pt-1")}>
      {isLeft && <ArrowLeft size={16} className="inline" />}
      <span>{children}</span>

      {!isLeft && <ArrowRight size={16} className="inline" />}
    </Link>
  );
}
