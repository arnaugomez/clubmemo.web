import type { UserModel } from "@/src/auth/domain/models/user-model";
import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import { SettingsChangePasswordSection } from "@/src/settings/ui/components/settings-change-password-section";
import { SettingsDeleteUserSection } from "@/src/settings/ui/components/settings-delete-user-section";
import { SettingsLogoutSection } from "@/src/settings/ui/components/settings-logout-section";
import { User } from "lucide-react";
import { notFound } from "next/navigation";

export default async function SettingsPage() {
  const { user } = await fetchSession();
  if (!user) notFound();
  return <SettingsPageLoaded user={user} />;
}

interface SettingsPageLoadedProps {
  user: UserModel;
}

function SettingsPageLoaded({ user }: SettingsPageLoadedProps) {
  return (
    <main>
      <div className="h-24" />
      <div className="px-4">
        <div className="mx-auto max-w-prose">
          <div className="items-baseline justify-between sm:flex">
            <h1 className={cn(textStyles.h2)}>Ajustes</h1>
            <div className="h-4" />
            <p className={cn(textStyles.p, "italic")}>
              <User size={17} className="mb-[1px] mr-1 inline" />
              {user.email}
            </p>
          </div>
          <div className="h-10" />
          <SettingsLogoutSection />
          <div className="h-12" />
          <SettingsChangePasswordSection />
          <div className="h-12" />
          <SettingsDeleteUserSection email={user.email} />
        </div>
      </div>
    </main>
  );
}
