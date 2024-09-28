import { fetchSession } from "../../../../auth/ui/fetch/fetch-session";
import { NavbarLink } from "./navbar-link";

/**
 * Loads user session and shows a list of navbar links if the user is logged in,
 * otherwise shows nothing.
 */
export async function NavbarLinks() {
  const { session, user } = await fetchSession();
  return session ? <NavbarLinksLoaded isAdmin={user.isAdmin} /> : null;
}

interface NavbarLinksLoadedProps {
  isAdmin: boolean;
}

/**
 * List of navbar links that is shown when the user is logged in.
 */
export function NavbarLinksLoaded({ isAdmin }: NavbarLinksLoadedProps) {
  return (
    <span className="space-x-4">
      {isAdmin && <NavbarLink href="/admin">Admin</NavbarLink>}
      <NavbarLink href="/learn">Aprender</NavbarLink>
      <NavbarLink className="hidden sm:inline" href="/discover">
        Descubrir
      </NavbarLink>
    </span>
  );
}
