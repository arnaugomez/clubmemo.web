import { Suspense } from "react";
import { NavbarLinks } from "./navbar-links";
import {
  NavbarUserSection,
  NavbarUserSectionLoaded,
} from "./navbar-user-section";
import { NavbarLogo } from "./navgar-logo";

export function Navbar() {
  return (
    <header className="h-16 flex-none">
      <nav className="fixed inset-x-0 top-0 z-10 flex h-16 items-center justify-between border-b-[1px] border-slate-200 bg-white px-6">
        <NavbarLogo />

        <div className="flex items-center space-x-8">
          <Suspense>
            <NavbarLinks />
          </Suspense>
          <Suspense fallback={<NavbarUserSectionLoaded />}>
            <NavbarUserSection />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
