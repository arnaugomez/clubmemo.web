import { Github } from "lucide-react";
import { textStyles } from "../../styles/text-styles";
import { cn } from "../../utils/shadcn";
import { Button } from "../shadcn/ui/button";

export function Footer() {
  return (
    <footer className="px-8 py-16 sm:py-24">
      <p className={cn(textStyles.p, "text-center text-slate-600")}>
        <span className={cn(textStyles.logo)}>clubmemo </span> es un proyecto de
        Arnau Gómez
      </p>
      <div className="h-2" />
      <p className={cn(textStyles.muted, "text-center")}>
        <a className="hover:underline" href="/compliance/license.txt">
          Licencia de uso
        </a>
        {" - "}
        <a className="hover:underline" href="/compliance/cookies.md">
          Cookies
        </a>
        {" - "}
        <a className="hover:underline" href="/compliance/privacy.md">
          Política de privacidad
        </a>
      </p>
      <div className="h-4" />
      <div className="flex justify-center space-x-4 text-muted-foreground">
        <Button variant="ghost" size="icon" asChild>
          <a href="https://github.com/arnaugomez/clubmemo.web">
            <Github />
          </a>
        </Button>
      </div>
    </footer>
  );
}
