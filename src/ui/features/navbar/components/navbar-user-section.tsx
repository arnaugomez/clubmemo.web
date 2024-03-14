"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "lucide-react";

export function NavbarUserSection() {
  // TODO show image
  return (
    <Link href="/profile">
      <Avatar>
        <AvatarImage alt="Imagen de perfil" />
        <AvatarFallback />
      </Avatar>
      <span className="sr-only">Página de perfil</span>
    </Link>
  );
  // return (
  //   <AsyncButton onClick={() => logoutAction()} variant="outline">
  //     Logout
  //   </AsyncButton>
  // );
}
