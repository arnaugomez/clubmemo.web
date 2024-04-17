import { fetchSession } from "../../auth/fetch/fetch-session";
import { NavbarLink } from "./navbar-link";

export async function NavbarLinksSection() {
  const result = await fetchSession();
  if (!result.session) return null;

  return (
    <span className="hidden space-x-4 sm:inline">
      <NavbarLink href="/learn">Aprender</NavbarLink>
      <NavbarLink href="/discover">Descubrir</NavbarLink>
    </span>
  );
}
