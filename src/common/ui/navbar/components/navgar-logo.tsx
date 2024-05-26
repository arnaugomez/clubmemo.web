import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";
import Link from "next/link";
import { Suspense } from "react";
import { textStyles } from "../../styles/text-styles";
import { cn } from "../../utils/shadcn";

const title = "clubmemo";
export function NavbarLogo() {
  return (
    <span className={cn(textStyles.logo, "text-slate-700")}>
      <Suspense fallback={title}>
        <NavbarTitleLoader />
      </Suspense>
    </span>
  );
}

async function NavbarTitleLoader() {
  const result = await fetchSession();
  return <NavbarTitle isLoggedIn={Boolean(result.session)} />;
}

interface NavbarTitleProps {
  isLoggedIn: boolean;
}

export function NavbarTitle({ isLoggedIn = false }: NavbarTitleProps) {
  return isLoggedIn ? <Link href="/home">{title}</Link> : <>{title}</>;
}
