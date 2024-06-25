import { AuthLogo } from "./auth-logo";

/**
 * Left side of the authentication page.
 * It contains a decoration image.
 */
export function AuthLeftPanel() {
  return (
    <div className="gradient-animation hidden flex-1 md:block">
      <AuthLogo />
    </div>
  );
}
