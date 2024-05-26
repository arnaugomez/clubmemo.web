import { fetchSession } from "../../../../auth/ui/fetch/fetch-session";
import { NavbarLink } from "./navbar-link";

export async function NavbarLinks() {
  const { session } = await fetchSession();
  return session ? <NavbarLinksLoaded /> : null;
}

export function NavbarLinksLoaded() {
  return (
    <span className="hidden space-x-4 sm:inline">
      <NavbarLink href="/learn">Aprender</NavbarLink>
      <NavbarLink href="/discover">Descubrir</NavbarLink>
    </span>
  );
}
