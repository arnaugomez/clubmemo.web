import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { PropsWithChildren } from "react";
import { Suspense, lazy } from "react";
import "./globals.css";

const Toaster = lazy(async () => {
  const file = await import("../src/common/ui/components/shadcn/ui/sonner");
  return { default: file.Toaster };
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "clubmemo",
  description: "Tu asistente AI para el estudio eficiente",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <Suspense>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
