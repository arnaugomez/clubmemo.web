import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="divide-slate-300 sm:flex sm:h-screen md:divide-x-[1px]">
      <div className="gradient-animation hidden flex-1 md:block">
        <Logo />
      </div>
      <div className="relative flex-1 sm:flex sm:overflow-y-auto">
        <div className="absolute md:hidden">
          <Logo />
        </div>
        <div className="my-auto w-full px-6 py-8">
          <div className="mx-auto max-w-80">
            <div className="h-28 sm:hidden" />
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

function Logo() {
  return (
    <div className="px-6 py-4">
      <div className={cn(textStyles.logo, "text-slate-700")}>clubmemo</div>
    </div>
  );
}
