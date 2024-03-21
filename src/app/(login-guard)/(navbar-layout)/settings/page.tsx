import { UserModel } from "@/src/core/auth/domain/models/user-model";
import { fetchSession } from "@/src/ui/features/auth/fetch/fetch-session";
import { SettingsChangePasswordSection } from "@/src/ui/features/settings/components/settings-change-password-section";
import { SettingsDeleteUserSection } from "@/src/ui/features/settings/components/settings-delete-user-section";
import { SettingsLogoutSection } from "@/src/ui/features/settings/components/settings-logout-section";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
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
          <div className="sm:flex justify-between items-baseline">
            <h1 className={cn(textStyles.h2)}>Ajustes</h1>
            <div className="h-4" />
            <p className={cn(textStyles.p, "italic")}>
              <User size={17} className="inline mr-1 mb-[1px]" />
              {user.email}
            </p>
          </div>
          <div className="h-10" />
          <SettingsLogoutSection />
          <div className="h-12" />
          <SettingsChangePasswordSection />
          <div className="h-12" />
          <SettingsDeleteUserSection />
        </div>
      </div>
    </main>
  );
}
