import { Navbar } from "@/src/common/ui/navbar/components/navbar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh flex-col">
      <Navbar />
      <main className="relative min-h-0 flex-1">{children}</main>
    </div>
  );
}
