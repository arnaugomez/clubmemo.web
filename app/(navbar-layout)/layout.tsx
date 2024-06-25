import { Footer } from "@/src/common/ui/components/footer/footer";
import { Navbar } from "@/src/common/ui/navbar/components/navbar";
import type { PropsWithChildren } from "react";

/**
 * Basic layout of the app. It contains a navbar, a body and a footer. This layout is used in pages that
 * have got scroll in the main body element.
 */
export default function NavbarLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
