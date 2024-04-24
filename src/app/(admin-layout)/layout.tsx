import { Navbar } from "@/src/ui/features/navbar/components/navbar";

export default async function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex h-dvh flex-col">
      <Navbar />
      <div className="relative min-h-0 flex-1">{children}</div>
    </main>
  );
}
