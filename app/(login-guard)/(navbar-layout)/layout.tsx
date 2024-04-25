import { Footer } from "@/src/common/ui/components/footer/footer";
import { Navbar } from "@/src/common/ui/navbar/components/navbar";

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
