import { Footer } from "@/src/common/ui/components/footer/footer";
import { Navbar } from "@/src/common/ui/navbar/components/navbar";
import type { PropsWithChildren } from "react";

export default function NavbarLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
