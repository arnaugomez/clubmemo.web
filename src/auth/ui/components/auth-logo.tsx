import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";

/**
 * Logo of the platform that is showed in the authentication pages.
 */
export function AuthLogo() {
  return (
    <div className="px-6 py-4">
      <div className={cn(textStyles.logo, "text-slate-700")}>clubmemo</div>
    </div>
  );
}
