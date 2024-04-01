import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { fetchMyProfile } from "../../profile/fetch/fetch-my-profile";

export function HomeGreeting() {
  return (
    <div className="px-4">
      <div className="mx-auto max-w-prose">
        <h1 className={cn(textStyles.h2, "mx-auto max-w-prose")}>
          Bienvenido de nuevo
          <ProfileName />
        </h1>
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
