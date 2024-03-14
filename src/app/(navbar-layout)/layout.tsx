import { Footer } from "@/src/ui/components/footer/footer";
import { Navbar } from "@/src/ui/features/navbar/components/navbar";

export default async function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
