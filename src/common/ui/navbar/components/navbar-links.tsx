import { fetchSession } from "../../../../auth/ui/fetch/fetch-session";
import { NavbarLink } from "./navbar-link";

export async function NavbarLinks() {
  const { session } = await fetchSession();
  return session ? <NavbarLinksLoaded /> : null;
}

export function NavbarLinksLoaded() {
  return (
    <span className="space-x-4">
      <NavbarLink href="/learn">Aprender</NavbarLink>
      <NavbarLink className="hidden sm:inline" href="/discover">
        Descubrir
      </NavbarLink>
    </span>
  );
}
