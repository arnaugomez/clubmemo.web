"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/ui/components/shadcn/ui/avatar";
import { User } from "lucide-react";
import Link from "next/link";

export function NavbarUserSection() {
  // TODO show image
  return (
    <Link href="/profile">
      <Avatar>
        <AvatarImage alt="Imagen de perfil" />
        <AvatarFallback className="text-slate-500 hover:bg-slate-200">
          <User />
        </AvatarFallback>
      </Avatar>
      <span className="sr-only">Página de perfil</span>
    </Link>
  );
}
