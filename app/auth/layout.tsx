import { textStyles } from "@/lib/ui/styles/text-styles";
import { cn } from "@/lib/ui/utils/shadcn";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="md:flex md:h-screen divide-slate-200 md:divide-x-2">
      <div className="bg-slate-100 flex-1 hidden md:block">
        <Logo />
      </div>
      <div className="flex-1">
        <div className="md:hidden">
          <Logo />
        </div>

        {children}
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
