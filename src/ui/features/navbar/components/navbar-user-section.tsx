"use client";
import { AsyncButton } from "@/src/ui/components/button/async-button";
import { logoutAction } from "../../auth/actions/logout-action";

export function NavbarUserSection() {
  return (
    <AsyncButton onClick={() => logoutAction()} variant="outline">
      Logout
    </AsyncButton>
  );
}
