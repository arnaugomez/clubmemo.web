import { checkSession } from "@/src/check-session";
import { textStyles } from "@/src/ui/styles/text-styles";
import { MailCheck } from "lucide-react";
import { redirect } from "next/navigation";

async function verifyEmailGuard() {
  const result = await checkSession();
  if (!result.session) {
    redirect("/login");
  }
  if (result.user.isEmailVerified) {
    redirect("/home");
  }
}

export default async function VerifyEmailPage() {
  await verifyEmailGuard();
  const { user } = await checkSession();
  return (
    <>
      <div className="w-full max-w-prose">
        <MailCheck size={32} />
        <div className="h-6"></div>
        <h1 className={textStyles.h2}>¡Ya casi estamos!</h1>
        <div className="h-4"></div>
        <p>
          Te hemos enviado un correo electrónico a {user?.email} con
          instrucciones para verificar tu cuenta.
        </p>
      </div>
    </>
  );
}
