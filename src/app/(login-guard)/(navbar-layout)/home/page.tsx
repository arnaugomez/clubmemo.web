import { HomeGreeting } from "@/src/ui/features/home/components/home-greeting";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";

export default function HomePage() {
  return (
    <main>
      <div className="h-24" />
      <HomeGreeting />

      <div className="h-6" />

      <section className="px-4">
        <div className="mx-auto max-w-prose">
          <h2 className={cn(textStyles.h3, "mx-auto max-w-prose")}>
            Sigue aprendiendo
          </h2>
        </div>
      </section>
      <div className="h-12" />
      <section className="px-4">
        <div className="mx-auto max-w-prose">
          <h2 className={cn(textStyles.h3, "mx-auto max-w-prose")}>
            Tu progreso
          </h2>
        </div>
      </section>
      <div className="h-12" />
      <section className="px-4">
        <div className="mx-auto max-w-prose">
          <h2 className={cn(textStyles.h3, "mx-auto max-w-prose")}>
            Te puede interesar
          </h2>
        </div>
      </section>
    </main>
  );
}
