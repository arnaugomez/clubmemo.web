import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "../../components/shadcn/ui/button";
import { textStyles } from "../../styles/text-styles";
import { cn } from "../../utils/shadcn";
import { NavbarLinksSection } from "./navbar-links-section";
import { NavbarUserSection } from "./navbar-user-section";

export function Navbar() {
  return (
    <header className="h-16 flex-none">
      <nav className="fixed inset-x-0 top-0 z-10 flex h-16 items-center justify-between border-b-[1px] border-slate-200 bg-white px-6">
        <span className={cn(textStyles.logo, "text-slate-700")}>
          <Suspense fallback="clubmemo">
            <NavbarTitle />
          </Suspense>
        </span>

        <div className="flex items-center space-x-8">
          <Suspense>
            <NavbarLinksSection />
          </Suspense>
          <Suspense>
            <UserSection />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}

async function NavbarTitle() {
  const result = await fetchSession();
  return result.session ? <Link href="/home">clubmemo</Link> : "clubmemo";
}

async function UserSection() {
  const result = await fetchSession();
  if (!result.session || !result.user.isEmailVerified) {
    return (
      <Button variant="outline" asChild>
        <Link href="/auth/login">Login</Link>
      </Button>
    );
  }
  return <NavbarUserSection />;
}