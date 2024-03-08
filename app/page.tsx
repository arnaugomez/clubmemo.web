import { Button } from "@/lib/ui/components/ui/button";
import clsx from "clsx";
import { FileUp, GraduationCap, Layers } from "lucide-react";

const textStyles = {
  logo: "text-2xl font-bold",
  h1: "text-5xl font-extrabold",
  h2: "text-3xl font-semibold",
  h3: "text-2xl font-semibold",
  h4: "text-xl font-semibold",
  lead: "text-xl",
  p: "text-base font-normal",
};

export default function Home() {
  return (
    <>
      <header className="sticky top-0">
        <nav className="h-16 flex justify-between items-center px-6 border-slate-200 border-b-[1px]">
          <div className={clsx(textStyles.logo, "text-slate-700")}>
            clubmemo
          </div>
          <Button variant="outline">Login</Button>
        </nav>
      </header>
      <main>
        <div className="py-36">
          <h1 className={clsx(textStyles.h1, "text-center px-8")}>
            Olvídate de memorizar
          </h1>
          <div className="h-12" />

          <div className="mx-auto px-8 flex flex-col space-y-4 w-fit">
            <div className="flex items-center">
              <div className="pr-4 text-slate-700">
                <FileUp />
              </div>
              <p className={clsx(textStyles.lead, "text-slate-500")}>
                Sube tus apuntes
              </p>
            </div>
            <div className="flex items-center">
              <div className="pr-4 text-slate-700">
                <Layers />
              </div>
              <p className={clsx(textStyles.lead, "text-slate-500")}>
                Genera flashcards con A.I.
              </p>
            </div>
            <div className="flex items-center">
              <div className="pr-4 text-slate-700">
                <GraduationCap />
              </div>
              <p className={clsx(textStyles.lead, "text-slate-500")}>
                Estudia de forma divertida y eficiente
              </p>
            </div>
          </div>
          <div className="h-12" />

          <div className="mx-auto px-8 flex space-x-8 w-fit">
            <Button variant="ghost">Login</Button>
            <Button variant="default">Crear cuenta</Button>
          </div>
        </div>
        <div className="border-y-[1px] border-slate-200 bg-slate-100 py-16">
          <h1 className={clsx(textStyles.h2, "text-center px-8")}>
            ¿Por qué clubmemo es tan eficiente?
          </h1>
          <div className="h-6" />
          <p
            className={clsx(
              textStyles.p,
              "mx-auto px-8 text-center max-w-prose",
            )}
          >
            Clubmemo es más eficiente que leer tus apuntes. Su método se apoya
            en 3 técnicas de estudio avaladas por la ciencia:
            <div className="flex space-x-12"></div>
          </p>
        </div>
      </main>
    </>
  );
}
