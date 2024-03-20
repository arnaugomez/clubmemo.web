import { checkSessionProvider } from "../../auth/providers/check-session-provider";
import { NavbarLink } from "./navbar-link";

export async function NavbarLinksSection() {
  const result = await checkSessionProvider();
  if (!result.session) return null;

  return (
    <span className="space-x-4 hidden sm:inline">
      <NavbarLink href="/learn">Aprender</NavbarLink>
      <NavbarLink href="/discover">Descubrir</NavbarLink>
    </span>
  );
}
