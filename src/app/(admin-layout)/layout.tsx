import { Navbar } from "@/src/ui/features/navbar/components/navbar";

export default async function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-vh flex flex-col">
      <Navbar />
      <main className="min-h-0 flex-1">{children}</main>
    </div>
  );
}
