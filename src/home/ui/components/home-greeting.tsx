import { textStyles } from "@/src/common/ui/styles/text-styles";
import { Bot } from "lucide-react";
import { fetchMyProfile } from "../../../profile/ui/fetch/fetch-my-profile";

export function HomeGreeting() {
  return (
    <div className="px-4">
      <div className="mx-auto max-w-prose">
        <h1 className={textStyles.h2}>
          <Bot className="mr-3 inline size-8 -translate-y-1" />
          Bienvenido de nuevo
          <ProfileName />
        </h1>
        <div className="h-2" />
        <p className={textStyles.base}>
          Te hemos preparado un plan de aprendizaje personalizado para hoy.
        </p>
      </div>
    </div>
  );
}

async function ProfileName() {
  const profile = await fetchMyProfile();
  if (profile?.displayName) {
    return <>, {profile.displayName}</>;
  }
  return <></>;
}
