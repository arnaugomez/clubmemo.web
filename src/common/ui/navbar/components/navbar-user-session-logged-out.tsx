import Link from "next/link";
import { Button } from "../../components/shadcn/ui/button";

export function NavbarUserSectionLoggedOut() {
  return (
    <Button variant="outline" asChild>
      <Link href="/auth/login">Login</Link>
    </Button>
  );
}
