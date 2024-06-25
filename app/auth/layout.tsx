import { AuthLeftPanel } from "@/src/auth/ui/components/auth-left-panel";
import { AuthLogo } from "@/src/auth/ui/components/auth-logo";
import type { PropsWithChildren } from "react";

/**
 * Layout that is common to all the authentication-related pages. It shows two panels:
 * one with a decoration image and the other with the main content of the page (for
 * example, the login form).
 */
export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <main className="divide-slate-300 sm:flex sm:h-screen md:divide-x-[1px]">
      <AuthLeftPanel />
      <div className="relative flex-1 sm:flex sm:overflow-y-auto">
        <div className="absolute md:hidden">
          <AuthLogo />
        </div>
        <div className="my-auto w-full px-6 py-8">
          <div className="mx-auto max-w-80">
            <div className="h-28 sm:hidden" />
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
