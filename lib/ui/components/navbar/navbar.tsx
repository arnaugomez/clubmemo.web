import Link from "next/link";
import { textStyles } from "../../styles/text-styles";
import { cn } from "../../utils/shadcn";
import { Button } from "../shadcn/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0">
      <nav className="h-16 flex justify-between items-center px-6 border-slate-200 border-b-[1px] bg-white">
        <div className={cn(textStyles.logo, "text-slate-700")}>clubmemo</div>
        <Button variant="outline" asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
      </nav>
    </header>
  );
}
