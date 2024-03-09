import { textStyles } from "@/lib/ui/styles/text-styles";
import { cn } from "@/lib/ui/utils/shadcn";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="md:flex md:h-screen divide-slate-300 md:divide-x-[1px]">
      <div className="gradient-animation flex-1 hidden md:block">
        <Logo />
      </div>
      <div className="flex-1 relative md:overflow-auto flex">
        <div className="md:hidden absolute">
          <Logo />
        </div>
        <div className="p-8 m-auto">{children}</div>
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
