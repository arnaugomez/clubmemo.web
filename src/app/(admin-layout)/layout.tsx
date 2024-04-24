import { Navbar } from "@/src/ui/features/navbar/components/navbar";

export default async function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative h-dvh">
      <div className="absolute inset-0 flex flex-col">
        <Navbar />
        <div className="relative min-h-0 flex-1">{children}</div>
      </div>
    </main>
  );
}
