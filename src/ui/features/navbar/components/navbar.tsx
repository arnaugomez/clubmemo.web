import { checkSessionProvider } from "@/src/ui/features/auth/providers/check-session-provider";
import Link from "next/link";
import { Button } from "../../../components/shadcn/ui/button";
import { textStyles } from "../../../styles/text-styles";
import { cn } from "../../../utils/shadcn";
import { NavbarUserSection } from "./navbar-user-section";

export async function Navbar() {
  const result = await checkSessionProvider();
  return (
    <header className="sticky top-0">
      <nav className="h-16 flex justify-between items-center px-6 border-slate-200 border-b-[1px] bg-white">
        <div className={cn(textStyles.logo, "text-slate-700")}>
          {result.session ? <Link href="/home">clubmemo</Link> : "clubmemo"}
        </div>
        <UserSection />
      </nav>
    </header>
  );
}

async function UserSection() {
  const result = await checkSessionProvider();
  if (!result.session || !result.user.isEmailVerified) {
    return (
      <Button variant="outline" asChild>
        <Link href="/auth/login">Login</Link>
      </Button>
    );
  }
  return <NavbarUserSection />;
}
