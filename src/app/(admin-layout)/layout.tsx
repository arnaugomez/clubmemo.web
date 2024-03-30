import { Navbar } from "@/src/ui/features/navbar/components/navbar";

export default async function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={"h-dvh flex flex-col" + " h-screen"}>
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
