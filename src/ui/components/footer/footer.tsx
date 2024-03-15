import { Github } from "lucide-react";
import { textStyles } from "../../styles/text-styles";
import { cn } from "../../utils/shadcn";
import { Button } from "../shadcn/ui/button";

export function Footer() {
  return (
    <footer className="py-24 px-8">
      <p className={cn(textStyles.p, "text-center text-slate-600")}>
        <span className={cn(textStyles.logo)}>clubmemo </span> es un proyecto de
        Arnau Gómez
      </p>
      <div className="h-2" />
      <p className={cn(textStyles.muted, "text-center")}>
        <a
          className="hover:underline"
          href="https://raw.githubusercontent.com/arnaugomez/clubmemo.web/main/LICENSE.txt"
        >
          Licencia de uso EUPL
        </a>{" "}
        -{" "}
        <a className="hover:underline" href="">
          Política de privacidad
        </a>
      </p>
      <div className="h-4" />
      <div className="flex space-x-4 justify-center text-muted-foreground">
        <Button variant="ghost" size="icon" asChild>
          <a href="https://github.com/arnaugomez/clubmemo.web">
            <Github />
          </a>
        </Button>
      </div>
    </footer>
  );
}
